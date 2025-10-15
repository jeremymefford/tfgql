# Direct REST vs. GraphQL

Understanding the difference between querying Terraform Cloud/Enterprise directly and using the TFGQL facade helps illustrate the value this project provides. Below is a comparison that highlights the plumbing required to aggregate data across multiple organizations when working with the REST API versus the single GraphQL request needed when using this tool.

## Scenario

> Retrieve the list of teams a given user belongs to, across every organization **you** can access (respecting optional include/exclude lists).

### Direct API Approach

The shell script below demonstrates what you need to do with the REST API alone: discover the user’s organizations, iterate over each, stream paginated team results, and gracefully handle rate limiting.

```bash
#!/usr/bin/env bash

set -euo pipefail

API_BASE="https://app.terraform.io/api/v2"
USER_ID="$1"
TOKEN="${TF_API_TOKEN:?set TF_API_TOKEN}"
INCLUDE_CSV="${2:-}"
EXCLUDE_CSV="${3:-}"

IFS=',' read -r -a INCLUDE_ORGS <<<"$INCLUDE_CSV"
IFS=',' read -r -a EXCLUDE_ORGS <<<"$EXCLUDE_CSV"

auth_header() {
  printf 'Authorization: Bearer %s' "$TOKEN"
}

retry_sleep() {
  local response_headers=$1
  local retry_after=$(printf '%s\n' "$response_headers" | awk -F': ' 'tolower($1)=="retry-after" {print $2}')
  local reset=$(printf '%s\n' "$response_headers" | awk -F': ' 'tolower($1)=="x-ratelimit-reset" {print $2}')
  local delay=${retry_after:-${reset:-1}}
  if [[ $delay -gt 60 ]]; then
    delay=60
  fi
  sleep "$delay"
}

fetch_with_retries() {
  local url=$1
  local -n body_ref=$2
  local -n headers_ref=$3

  while true; do
    # shellcheck disable=SC2154
    response=$(curl -s -D - \
      -H "Content-Type: application/vnd.api+json" \
      -H "$(auth_header)" \
      "$url")

    headers_ref=$(printf '%s\n' "$response" | sed '/^$/q')
    status=$(printf '%s\n' "$headers_ref" | awk 'NR==1 {print $2}')
    body_ref=$(printf '%s\n' "$response" | sed '1,/^$/d')

    if [[ $status -eq 429 ]]; then
      retry_sleep "$headers_ref"
      continue
    fi

    if [[ $status -ge 200 && $status -lt 300 ]]; then
      break
    fi

    echo "Request failed with status $status" >&2
    exit 1
  done
}

# 1. Fetch organizations the calling user can access.
org_memberships_url="$API_BASE/organization-memberships"
declare -A ORG_SET=()
page=1
while true; do
  url="$org_memberships_url?page%5Bnumber%5D=$page"
  fetch_with_retries "$url" body headers
  ids=$(jq -r '.data[].relationships.organization.data.id' <<<"$body")
  if [[ -z $ids ]]; then
    break
  fi
  while read -r org; do
    [[ -n $org ]] && ORG_SET["$org"]=1
  done <<<"$ids"

  total_pages=$(jq -r '.meta.pagination."total-pages" // 1' <<<"$body")
  if (( page >= total_pages )); then
    break
  fi
  ((page++))
done

readarray -t ACCESSIBLE_ORGS < <(printf '%s\n' "${!ORG_SET[@]}" | sort)

# Apply include/exclude semantics (match tfgql's coalesceOrgs helper).
filtered_orgs=()
if (( ${#INCLUDE_ORGS[@]} > 0 )) && [[ -n ${INCLUDE_ORGS[0]:-} ]]; then
  for org in "${ACCESSIBLE_ORGS[@]}"; do
    for include in "${INCLUDE_ORGS[@]}"; do
      if [[ "$org" == "$include" ]]; then
        filtered_orgs+=("$org")
        break
      fi
    done
  done
else
  filtered_orgs=("${ACCESSIBLE_ORGS[@]}")
fi

if (( ${#EXCLUDE_ORGS[@]} > 0 )) && [[ -n ${EXCLUDE_ORGS[0]:-} ]]; then
  tmp=()
  for org in "${filtered_orgs[@]}"; do
    skip=false
    for exclude in "${EXCLUDE_ORGS[@]}"; do
      [[ "$org" == "$exclude" ]] && skip=true && break
    done
    $skip || tmp+=("$org")
  done
  filtered_orgs=("${tmp[@]}")
fi

if (( ${#filtered_orgs[@]} == 0 )); then
  echo "No organizations to query after include/exclude filtering" >&2
  exit 0
fi

# 2. For each organization, stream paginated team results with include=users.
teams_for_user=()
for org in "${filtered_orgs[@]}"; do
  page=1
  while true; do
    teams_url="$API_BASE/organizations/$org/teams?page%5Bnumber%5D=$page&page%5Bsize%5D=100&include=users"
    fetch_with_retries "$teams_url" body headers

    mapfile -t matches < <(
      jq -r --arg user "$USER_ID" '
        .data[]
        | select((.relationships.users.data // []) | any(.id == $user))
        | .attributes.name
      ' <<<"$body"
    )
    if (( ${#matches[@]} > 0 )); then
      teams_for_user+=("${matches[@]}")
    fi

    total_pages=$(jq -r '.meta.pagination."total-pages" // 1' <<<"$body")
    if (( page >= total_pages )); then
      break
    fi
    ((page++))
  done
done

printf 'Teams for user %s:\n' "$USER_ID"
printf ' - %s\n' "${teams_for_user[@]}"
```

### GraphQL Approach

With TFGQL, the same request collapses into a single query. Multi-org traversal and pagination happen server-side, and rate limiting is handled by the backend.

```graphql
query UserTeams {
  user(id: "<my-user-id>") {
    username
    teams(includeOrgs: ["my-corp-org"], excludeOrgs: ["my-personal-org"]) {
      id
      name
      organization { id }
    }
  }
}
```

Pass empty arrays (`[]`) for `includeOrgs` / `excludeOrgs` to mirror the default behavior of fanning out across every organization available to the caller while still letting you prune specific orgs when needed. No pagination or retry loops required—just a single request that returns the complete set of teams.

---

### Why It Matters

- **Less Plumbing:** Pagination, filtering, and rate limiting are handled by the GraphQL gateway.
- **Consistent Data Model:** The GraphQL schema provides typed relationships, so you can traverse from users to teams to organizations in one go.
- **Declarative Queries:** Express intent in a single document rather than writing scripts to aggregate REST endpoints.

:::warning
Since pagination is basically removed by this tool, query responses can get **very** large.  Ensure the runtime hosting this tool has adequate memory for the largest queries you think you will run.
:::
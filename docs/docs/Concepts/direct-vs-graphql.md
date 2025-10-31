# Direct REST vs. GraphQL

Understanding the difference between querying Terraform Cloud/Enterprise directly and using the TFGQL facade helps illustrate the value this project provides. Below is a comparison that highlights the plumbing required to aggregate data even within a single organization when working with the REST API versus the single GraphQL request needed when using this tool.

## Scenario

> Retrieve the list of teams a given user belongs to inside a specific organization.

### Direct API Approach

The shell script below demonstrates what you need to do with the REST API alone: resolve the caller’s user ID (or accept an override), iterate through paginated team results for the target organization, and gracefully handle rate limiting.

```bash
#!/usr/bin/env bash

set -euo pipefail

API_BASE="https://app.terraform.io/api/v2"
TOKEN="${TF_API_TOKEN:?set TF_API_TOKEN}"
ORG_SLUG="${1:?Usage: ./rest-teams.sh <organization-slug> [user-id]}"
USER_ID="${2:-}"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to parse Terraform Cloud responses" >&2
  exit 1
fi

auth_header() {
  printf 'Authorization: Bearer %s' "$TOKEN"
}

retry_sleep() {
  local headers_file=$1
  local retry_after
  local reset
  local delay

  retry_after=$(awk 'tolower($1)=="retry-after:" {gsub("\r",""); print $2}' "$headers_file")
  reset=$(awk 'tolower($1)=="x-ratelimit-reset:" {gsub("\r",""); print $2}' "$headers_file")
  delay=${retry_after:-${reset:-1}}

  if ! [[ "$delay" =~ ^[0-9]+$ ]]; then
    delay=1
  fi
  if (( delay > 60 )); then
    delay=60
  fi

  sleep "$delay"
}

request() {
  local url=$1

  while true; do
    local headers_file
    local body
    local status

    headers_file=$(mktemp)

    if ! body=$(
      curl -sS -D "$headers_file" \
      -H "Content-Type: application/vnd.api+json" \
      -H "$(auth_header)" \
      "$url"
    ); then
      rm -f "$headers_file"
      echo "Request to $url failed" >&2
      exit 1
    fi

    status=$(awk 'NR==1 {gsub("\r",""); print $2}' "$headers_file")

    if [[ "$status" == "429" ]]; then
      retry_sleep "$headers_file"
      rm -f "$headers_file"
      continue
    fi

    if [[ "$status" =~ ^2[0-9]{2}$ ]]; then
      rm -f "$headers_file"
      printf '%s' "$body"
      return 0
    fi

    echo "Request to $url failed with status ${status:-unknown}" >&2
    awk '{gsub("\r",""); print}' "$headers_file" >&2
    rm -f "$headers_file"
    exit 1
  done
}

USERNAME=""
if [[ -z "$USER_ID" ]]; then
  body=$(request "$API_BASE/account/details")
  USER_ID=$(printf '%s\n' "$body" | jq -r '.data.id // empty')
  USERNAME=$(printf '%s\n' "$body" | jq -r '.data.attributes.username // empty')
fi

if [[ -z "$USER_ID" ]]; then
  echo "Unable to determine user id from token" >&2
  exit 1
fi

teams=()
page=1
while true; do
  body=$(
    request \
      "$API_BASE/organizations/$ORG_SLUG/teams?page%5Bnumber%5D=$page&page%5Bsize%5D=100&include=users"
  )
  names=$(printf '%s\n' "$body" | jq -r --arg user "$USER_ID" '
    .data[]
    | select((.relationships.users.data // []) | any(.id == $user))
    | .attributes.name
  ')
  if [[ -n "$names" ]]; then
    while IFS= read -r team_name; do
      [[ -n "$team_name" ]] && teams+=("$team_name")
    done <<<"$names"
  fi

  total_pages=$(printf '%s\n' "$body" | jq -r '.meta.pagination."total-pages" // 1')
  [[ "$total_pages" =~ ^[0-9]+$ ]] || total_pages=1
  if (( page >= total_pages )); then
    break
  fi
  page=$((page + 1))
done

display_name=${USERNAME:-$USER_ID}

if (( ${#teams[@]} == 0 )); then
  printf 'No teams found for user %s in org %s\n' "$display_name" "$ORG_SLUG"
  exit 0
fi

printf 'Teams for user %s in org %s:\n' "$display_name" "$ORG_SLUG"
printf '%s\n' "${teams[@]}" | sort -u | while IFS= read -r team; do
  printf ' - %s\n' "$team"
done
```

### GraphQL Approach

With TFGQL, the same request collapses into a single query. Multi-org traversal and pagination happen server-side, and rate limiting is handled by the backend.

```graphql
query {
  me {
    teams {
      name
    }
  }
}
```

Pass an organization slug in `includeOrgs` to focus the query, or leave it empty to fan out across every organization the caller can access. No pagination or retry loops required—just a single request that returns the complete set of teams.

---

### Why It Matters

- **Less Plumbing:** Pagination, filtering, and rate limiting are handled by the GraphQL gateway.
- **Consistent Data Model:** The GraphQL schema provides typed relationships, so you can traverse from users to teams to organizations in one go.
- **Declarative Queries:** Express intent in a single document rather than writing scripts to aggregate REST endpoints.

:::warning
Since pagination is basically removed by this tool, query responses can get **very** large.  Ensure the runtime hosting this tool has adequate memory for the largest queries you think you will run.
:::

# Prometheus Metrics

TFGQL exposes Prometheus-compatible metrics at `GET /metrics`.

The endpoint is authenticated and executes configured GraphQL queries, then converts
the result rows into Prometheus metric families (`# HELP`, `# TYPE`, sample lines).

## How It Works

1. Your scraper calls `GET /metrics` with `Authorization: Bearer <encrypted-jwt>`.
2. TFGQL validates the JWT (issued by `POST /auth/token`).
3. For each configured metric definition, TFGQL runs its GraphQL query.
4. TFGQL extracts rows using `resultPath`, resolves labels, and computes a numeric value.
5. TFGQL renders Prometheus exposition text and returns `text/plain; version=0.0.4`.

Notes:

- Values are normalized to numbers. Booleans become `1`/`0`.
- Non-numeric values for gauge/counter rows are skipped.
- Metric names and label keys are sanitized to valid Prometheus names.
- Results are cached per token hash for `TFGQL_METRICS_CACHE_TTL` seconds.

## Scrape Cadence (Important)

:::warn
`/metrics` is not a cheap host-level exporter endpoint. Each scrape executes live
GraphQL queries and upstream Terraform API calls, which can be slow.

Scrape this endpoint occasionally, not every few seconds.
:::

Recommended starting point:

- `scrape_interval`: `30m`
- `scrape_timeout`: `120s`

Practical guidance:

- Use `15m` to `60m` intervals for most business metrics.
- For broad organization-wide queries, prefer `30m` or longer.
- Keep query scope narrow (`includeOrgs`, time windows, focused `resultPath`) to reduce scrape latency.

## Runtime Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `TFGQL_METRICS_ENABLED` | Enables the `/metrics` endpoint. Set to `false` to disable. | `true` |
| `TFGQL_METRICS_CONFIG` | Optional path to a JSON metrics definition file. If unset, built-in defaults are used. | _(unset)_ |
| `TFGQL_METRICS_CACHE_TTL` | Cache TTL in seconds for rendered `/metrics` output (per token). Set `0` to disable cache. | `60` |

## Authenticated Scrape Example

For long-running Prometheus jobs, you can mint either a default TTL token or an
infinite-lifetime token.

### Default TTL token (30 days by default)

```bash
JWT=$(curl -s -X POST http://127.0.0.1:4000/auth/token \
  -H 'content-type: application/json' \
  -d '{"tfcToken":"<your terraform token>"}' | jq -r '.token')

curl -s http://127.0.0.1:4000/metrics \
  -H "Authorization: Bearer ${JWT}"
```

`/auth/token` returns an `expiresAt` timestamp for this mode.

### Infinite-lifetime token

Set `infinite: true` when calling `/auth/token`:

```bash
JWT=$(curl -s -X POST http://127.0.0.1:4000/auth/token \
  -H 'content-type: application/json' \
  -d '{"tfcToken":"<your terraform token>","infinite":true}' | jq -r '.token')
```

In this mode, the response has `expiresAt: null` and the JWT has no expiration claim.

:::warn
Use infinite-lifetime tokens carefully. If you need tokens to survive process restarts,
set a stable `TFGQL_JWT_ENCRYPTION_KEY`; otherwise, tokens become invalid when the
server restarts.
:::

If auth is missing/invalid, `/metrics` returns HTTP `401`.

## Built-In Metrics

When `TFGQL_METRICS_CONFIG` is not set, TFGQL provides these defaults:

- `tfgql_workspace_resource_count`
- `tfgql_workspace_run_failures`
- `tfgql_workspace_locked`
- `tfgql_workspace_plan_duration_avg`
- `tfgql_workspace_apply_duration_avg`
- `tfgql_workspace_policy_check_failures`
- `tfgql_agent_status`
- `tfgql_explorer_terraform_version_workspace_count` (TFC only)

## Custom Metrics Config File

Set `TFGQL_METRICS_CONFIG` to a JSON file with a `metrics` array:

```json
{
  "metrics": [
    {
      "name": "tfgql_workspace_resource_count",
      "help": "Number of resources per workspace",
      "type": "gauge",
      "query": "query($orgs: [String!]) { workspaces(includeOrgs: $orgs) { name resourceCount organization { name } } }",
      "variables": { "orgs": ["my-org"] },
      "resultPath": "workspaces",
      "valueField": "resourceCount",
      "labels": {
        "organization": "organization.name",
        "workspace": "name"
      }
    }
  ]
}
```

Field behavior:

- `type`: `gauge`, `counter`, or `info`
- `resultPath`: dot path to an array in the GraphQL result
- `valueField`: required for `gauge`/`counter`, ignored for `info`
- `labels`: map of `label_name -> dot.path`
- `TFGQL_METRICS_CONFIG` currently expects JSON (not YAML)

Advanced pathing:

- `resultPath` supports `[]` flattening, for example: `agentPools[].agents`
- Child rows created through `[]` can reference parent fields via `__parent`, for example:
  `organization: "__parent.organizationName"`

## Policy Failure Metrics (Legacy Sentinel + Agent Mode Sentinel/OPA)

Policy failure telemetry spans two paths in Terraform:

- Legacy policy checks on `run.policyChecks` (Sentinel legacy flow)
- Agent-mode policy evaluations on `run.policyEvaluations` (Sentinel and OPA)

Both can exist on the same run. Treat them as separate metric families so you do
not accidentally double count failures.

Example definitions:

```json
{
  "metrics": [
    {
      "name": "tfgql_run_policy_check",
      "help": "Legacy Sentinel policy check state per run",
      "type": "info",
      "query": "query($orgs: [String!], $since: DateTime) { runs(includeOrgs: $orgs, filter: { createdAt: { _gt: $since } }) { id workspace { name organization { name } } policyChecks { status scope } } }",
      "variables": {
        "orgs": null,
        "since": "2026-01-01T00:00:00Z"
      },
      "resultPath": "runs[].policyChecks",
      "valueField": "",
      "labels": {
        "path": "legacy_policy_checks",
        "organization": "__parent.workspace.organization.name",
        "workspace": "__parent.workspace.name",
        "run_id": "__parent.id",
        "status": "status",
        "scope": "scope"
      }
    },
    {
      "name": "tfgql_run_policy_eval_mandatory_failed",
      "help": "Mandatory failures from agent-mode policy evaluations",
      "type": "gauge",
      "query": "query($orgs: [String!], $since: DateTime) { runs(includeOrgs: $orgs, filter: { createdAt: { _gt: $since } }) { id workspace { name organization { name } } policyEvaluations { status policyKind resultCount { mandatoryFailed advisoryFailed errored } } } }",
      "variables": {
        "orgs": null,
        "since": "2026-01-01T00:00:00Z"
      },
      "resultPath": "runs[].policyEvaluations",
      "valueField": "resultCount.mandatoryFailed",
      "labels": {
        "path": "agent_policy_evaluations",
        "organization": "__parent.workspace.organization.name",
        "workspace": "__parent.workspace.name",
        "run_id": "__parent.id",
        "policy_kind": "policyKind",
        "status": "status"
      }
    },
    {
      "name": "tfgql_run_policy_eval_advisory_failed",
      "help": "Advisory failures from agent-mode policy evaluations",
      "type": "gauge",
      "query": "query($orgs: [String!], $since: DateTime) { runs(includeOrgs: $orgs, filter: { createdAt: { _gt: $since } }) { id workspace { name organization { name } } policyEvaluations { status policyKind resultCount { mandatoryFailed advisoryFailed errored } } } }",
      "variables": {
        "orgs": null,
        "since": "2026-01-01T00:00:00Z"
      },
      "resultPath": "runs[].policyEvaluations",
      "valueField": "resultCount.advisoryFailed",
      "labels": {
        "path": "agent_policy_evaluations",
        "organization": "__parent.workspace.organization.name",
        "workspace": "__parent.workspace.name",
        "run_id": "__parent.id",
        "policy_kind": "policyKind",
        "status": "status"
      }
    }
  ]
}
```

Recommended interpretation:

- Use `tfgql_run_policy_check{status=...}` for legacy Sentinel checks
- Use `tfgql_run_policy_eval_*{policy_kind=...}` for agent-mode Sentinel/OPA
- Keep a time/window filter in your run query (`createdAt`) to control scrape cost and cardinality

## Troubleshooting

- Empty output with HTTP `200` means no metric samples were produced (for example, no rows matched your configured queries).
- A failing metric query is logged and skipped; other metrics still render.
- Invalid `TFGQL_METRICS_CONFIG` causes metrics evaluation to fail until fixed.
- If scrapes time out, increase `scrape_interval`/`scrape_timeout` and reduce query breadth.

# THIS PROJECT IS IN ALPHA, IT IS NOT READY FOR USE IN ANY CAPACITY OTHER THAN DEVELOPMENT

# TFC/E GraphQL

TFE GraphQL is a GraphQL interface for interacting with the Terraform Enterprise (TFE) and HCP Terraform (TFC) REST API. It enables clients to query TFE data using a flexible and powerful GraphQL schema, with support for filtering, nested relationships, pagination, rate-limiting, and request batching and management.

https://developer.hashicorp.com/terraform/enterprise/api-docs/changelog

## Features

- 🕸️ GraphQL interface over the TFE REST API
- 🔍 Advanced Hasura-style filtering
- 🌊 Streaming pagination for efficient retrieval of pages
- 🔐 TFC token-based authentication
- 🚦 Rate limit protection with exponential backoffs
- 🚀 Apollo Server 4
- 🧪 TypeScript-first codebase with strong typings
- 🔎 Observability: structured logging with trace correlation (trace_id/span_id)

## Documentation

This README is generally kept up-to-date, the docs folder contains a lot more useful information
and should be considered the primary place to author and consume docs.  It is currently not hosted
so please build and view locally.

This project uses [Docusaurus](https://docusaurus.io/) to host developer documentation.

### Run Docs Locally

To serve the documentation locally:

```bash
cd docs
npm install
npm run start
```

This will start a local dev server (typically on http://localhost:3000) where you can view and edit the documentation live.

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Terraform Cloud or Enterprise account
- A valid TFC/E API Token

### Install

```bash
npm install
```

### Environment Configuration

Ensure the runtime environment has the following variables:

### Environment Configuration

| Variable                          | Description                                | Default                         | Required |
|----------------------------------|--------------------------------------------|----------------------------------|----------|
| `TFC_TOKEN`                      | API token for TFC/TFE                      | —                                | ✅       |
| `TFE_BASE_URL`                   | Base URL for TFE API (normalized to end with `/api/v2`) | `https://app.terraform.io/api/v2` | ❌       |
| `TFCE_GRAPHQL_BATCH_SIZE`        | Max items per batch operation              | `10`                             | ❌       |
| `TFCE_GRAPHQL_PAGE_SIZE`         | Max items per page when paginating         | `100` (max: 100)                 | ❌       |
| `TFCE_GRAPHQL_RATE_LIMIT_MAX_RETRIES` | Max retries after HTTP 429 responses   | `50`                             | ❌       |
| `TFCE_GRAPHQL_SERVER_ERROR_MAX_RETRIES` | Max retries after 5xx responses      | `20`                             | ❌       |
| `TFCE_GRAPHQL_SERVER_ERROR_RETRY_DELAY` | Delay (ms) between 5xx retries      | `60000`                          | ❌       |
| `TFCE_GRAPHQL_REQUEST_CACHE_MAX_SIZE` | Max entries for request-level cache     | `5000`                           | ❌       |

### Run

```bash
npm start
```

The GraphQL API will start on http://localhost:4000 by default.

## Project Structure

The project is structured by domain entity.

```
src/
  common/               # Shared types, utilities, filters, etc.
  organizations/        # Organization schema, resolvers, and datasource
  workspaces/           # Workspace schema, resolvers, and datasource
  users/                # User schema, resolvers, and datasource
  teams/                # Team schema, resolvers, and datasource
  runs/                 # Run schema, resolvers, and datasource
  configurationVersions/ # Configuration Version schema, resolvers, and datasource
  variableSets/         # Variable Set schema, resolvers, and datasource
  variables/            # Variable schema, resolvers, and datasource
  projects/             # Project schema, resolvers, and datasource
  runTriggers/          # Run Trigger schema, resolvers, and datasource
  workspaceTeamAccess/  # Workspace Team Access schema, resolvers, and datasource
  workspaceResources/   # Workspace Resource schema, resolvers, and datasource
  server/               # Apollo server setup
  index.ts              # Entry point
```

| File            | Description                                |
|------------------|--------------------------------------------|
| `schema.ts`      | GraphQL schema for that domain.  Uses graphql-tag syntax in gql blocks |
| `resolvers.ts`   | Resolver logic                             |
| `types.ts`       | TypeScript types and domain models         |
| `dataSource.ts`  | REST API integration layer                 |

## Observability

### Logging & Tracing

The server emits structured logs via Pino. Each log line includes:

- `trace_id`, `span_id` for cross-service correlation (W3C trace context)

Request handling:

- The server parses an incoming `traceparent` header or generates one if absent.
- The same `traceparent` value is used as the `x-request-id` for consistency.
- Outbound HTTP calls propagate `traceparent` and `x-request-id` headers automatically.

The log context is bound per request using AsyncLocalStorage so both resolver-level and shared-module logs are correlated.

## Usage

### Example Query

"Retrieve runs' id and status for the prod workspace or any locked workspace"

```graphql
query Workspaces($orgName: String!) {
  workspaces(orgName: $orgName, filter: {
    _or: [
      { name: { _eq: "prod-app" } },
      { locked: { _eq: true } }
    ]
  }) {
    id
    name
    runs {
      id
      status
    }
  }
}
```

### Filtering

This project implements Hasura-style filtering to allow expressive and efficient queries against the TFC/E API. You can apply filters at any query level, including nested fields.

Filtering supports both logical operators and type-specific comparison operators.

In general, filtering is done after retrieving the data from TFC/E.  When supported by the TFC/E API, filtering will be passed
down to the API for server-side filtering. Be aware that even though the GraphQL return may be small, the query could still be
retrieving large amounts of data from TFC/E.

When filtering nested entities, it is important to remember that the 

#### Logical Operators (applies to any filter object)

| Operator | Description                        |
|----------|------------------------------------|
| `_and`   | Match if all filters are true      |
| `_or`    | Match if any filter is true        |
| `_not`   | Negate the result of the subfilter |

#### Type-Specific Comparison Operators

| Attribute Type | Operators Supported                                                                 |
|----------------|--------------------------------------------------------------------------------------|
| `String`       | `_eq`, `_neq`, `_like`, `_ilike`, `_in`, `_nin`, `_is_null`                          |
| `Number`       | `_eq`, `_neq`, `_gt`, `_gte`, `_lt`, `_lte`, `_in`, `_nin`, `_is_null`               |
| `Boolean`      | `_eq`, `_neq`, `_is_null`                                                            |
| `DateTime`     | `_eq`, `_neq`, `_gt`, `_gte`, `_lt`, `_lte`, `_in`, `_nin`, `_is_null`               |
| `Enum`         | `_eq`, `_neq`, `_in`, `_nin`, `_is_null`                                             |
| `TerraformVersion` | `_eq`, `_neq`, `_gt`, `_gte`, `_lt`, `_lte`, `_in`, `_nin`                     |

#### Examples

**Filter by name or locked workspaces:**
```graphql
filter: {
  _or: [
    { name: { _eq: "prod-app" } },
    { locked: { _eq: true } }
  ]
}
```


**Filter users by username with pattern matching:**
```graphql
filter: {
  username: { _ilike: "%admin%" }
}
```

**Filter runs by status and creation date:**
```graphql
filter: {
  status: { _in: ["planned", "applied"] },
  createdAt: { _gt: "2024-01-01T00:00:00Z" }
}
```

Generally, filters can be applied to nested fields:
```graphql
organization(name: "team-rts") {
  teams {
    users(filter: {
      _or: [
        { username: { _eq: "alice" }},
        { username: { _like: "bob%" }}
      ]
    }) {
      id
      username
    }
  }
}
```

## Implementation Status

Below is the current implementation status of the TFC API endpoint categories in this GraphQL wrapper. A check (✓) indicates that queries or mutations for that category are implemented:

| Category                         | Query | Mutations |
|----------------------------------|:-----:|:---------:|
| Account                          |       |           |
| Agent Pools                      |   ✓   |           |
| Agent Tokens                     |   ✓   |           |
| Applies                          |   ✓   |           |
| Audit Trails                     |       |           |
| Audit Trails Tokens              |       |           |
| Assessment Results               |   ✓   |           |
| Change requests                  |       |           |
| Comments                         |   ✓   |           |
| Configuration Versions           |   ✓   |           |
| Cost Estimates                   |       |           |
| Explorer                         |       |           |
| Feature Sets                     |       |           |
| GitHub App Installations         |       |           |
| Invoices                         |       |           |
| IP Ranges                        |       |           |
| No-Code Provisioning             |       |           |
| Notification Configurations      |       |           |
| OAuth Clients                    |       |           |
| OAuth Tokens                     |       |           |
| Organizations                    |   ✓   |           |
| Organization Memberships         |   ✓   |           |
| Organization Tags                |   ✓   |           |
| Organization Tokens              |       |           |
| Plan Exports                     |       |           |
| Plans                            |   ✓   |           |
| Policies                         |   ✓   |           |
| Policy Checks                    |       |           |
| Policy Evaluations               |   ✓   |           |
| Policy Sets                      |   ✓   |           |
| Policy Set Parameters            |   ✓   |           |
| Private Registry                 |       |           |
| Projects                         |   ✓   |           |
| Project Team Access              |   ✓   |           |
| Reserved Tag Keys                |       |           |
| Runs                             |   ✓   |           |
| Run Tasks                        |       |           |
| Run Triggers                     |       |           |
| SSH Keys                         |       |           |
| State Versions                   |       |           |
| State Version Outputs            |   ✓   |           |
| Subscriptions                    |       |           |
| Team Membership                  |       |           |
| Team Tokens                      |   ✓   |           |
| Teams                            |   ✓   |           |
| User Tokens                      |       |           |
| Users                            |   ✓   |           |
| Variables                        |   ✓   |           |
| Variable Sets                    |   ✓   |           |
| VCS Events                       |       |           |
| Workspaces                       |   ✓   |           |
| Workspace-Specific Variables     |       |           |
| Workspace Team Access            |   ✓   |           |
| Workspace Resources              |   ✓   |           |

## Development

### Compile

```bash
npm start
```

### Debug with VSCode

Use the following launch config:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug TFE GraphQL",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/dist/index.js",
  "preLaunchTask": "tsc: build - tsconfig.json",
  "env": {
    "TFC_TOKEN": "<token>"
  }
}
```

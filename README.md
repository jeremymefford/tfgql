# TFC/E GraphQL

TFE GraphQL is a GraphQL interface for interacting with the Terraform Enterprise (TFE) and HCP Terraform (TFC) REST API. It enables clients to query TFE data using a flexible and powerful GraphQL schema, with support for filtering, nested relationships, pagination, rate-limiting, and request batching and management.

## Features

- 🕸️ GraphQL interface over the TFC/E REST API
- 🔍 Advanced Hasura-style filtering
- 🌊 Streaming pagination for efficient retrieval of pages
- 🚦 Rate limit protection with exponential backoffs

## Documentation

[Official latest docs](https://jeremymefford.github.io/tfce-graphql/)

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
| `TFCE_SERVER_TLS_CERT_FILE`        | Path to PEM-encoded certificate (and chain) for HTTPS termination | — | ❌ |
| `TFCE_SERVER_TLS_KEY_FILE`         | Path to PEM-encoded private key for HTTPS termination           | — | ❌ |
| `TFCE_SERVER_TLS_CA_FILE`          | Optional PEM bundle for client auth / certificate chain         | — | ❌ |
| `TFCE_SERVER_TLS_KEY_PASSPHRASE`   | Optional passphrase for the HTTPS private key                   | — | ❌ |
| `LOG_LEVEL`                      | Pino log level (`fatal`,`error`,`warn`,`info`,`debug`,`trace`) | `info` | ❌ |
| `NODE_ENV`                       | Node environment; `development` enables pretty logs           | —      | ❌ |

### Run

```bash
npm start
```

The GraphQL API will start on http://localhost:4000 by default. If `TFCE_SERVER_TLS_CERT_FILE` and `TFCE_SERVER_TLS_KEY_FILE` are provided, the server listens with HTTPS instead (terminating TLS inside the Node.js process). See [TLS.md](TLS.md) for deployment guidance and performance caveats.

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

Log configuration:

- Set `LOG_LEVEL` to control verbosity (default `info`).
- When `NODE_ENV=development`, logs are human-friendly via `pino-pretty` (single-line, colorized).

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

## Development

### Compile

```bash
npm start
```

### Debug with VSCode

Use the following launch config:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Compile and Run",
            "preLaunchTask": "tsc: build - tsconfig.json",
            "program": "${workspaceFolder}/dist/index.js",
            "outputCapture": "std",
            "cwd": "${workspaceFolder}",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "env": {
                "TFC_TOKEN": <token>,
                "LOG_LEVEL": "trace",
                "NODE_ENV": "development"
            }
        }
    ]
}
```

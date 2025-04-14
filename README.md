# TFE GraphQL

TFE GraphQL is a GraphQL interface for interacting with the Terraform Enterprise (TFE) and HCP Terraform (TFC) REST API. It enables clients to query TFE data using a flexible and powerful GraphQL schema, with support for filtering, nested relationships, pagination, rate-limiting, and request batching and management.

## Features

- 🚀 GraphQL interface over the TFE REST API
- 🔍 Advanced Hasura-style filtering
- 🌊 Streaming pagination for efficient retrieval of pages
- 🔐 TFC token-based authentication
- 🧩 Modular architecture with domain-driven separation
- ⚙️ Apollo Server 4
- 🧪 TypeScript-first codebase with strong typings

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

Ensure the runtime enviornment has the proper values 

```env
TFC_TOKEN=<your-tfc/e-token>             # REQUIRED
TFE_BASE_URL=https://app.terraform.io  # optional, defaults to TFC
GRAPHQL_BATCH_SIZE=10                  # optional, default: 10
TFC_PAGE_SIZE=100                      # optional, max: 100
```

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
  server/               # Apollo server setup
  index.ts              # Entry point
```

Each domain folder typically contains:

- `schema.graphql` – GraphQL schema for that domain
- `resolvers.ts` – Resolver logic
- `types.ts` – TypeScript types and domain models
- `dataSource.ts` – REST API integration layer

## Usage

### Example Query

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

Filtering supports a variety of operators:

- `_eq`, `_neq`, `_gt`, `_gte`, `_lt`, `_lte`
- `_like`, `_ilike`, `_in`, `_nin`
- Logical operators: `_and`, `_or`, `_not`

Supports nested filters (e.g., `teams.users` or `workspace.runs`).

## Development

### Compile

```bash
npm run compile
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
  "preLaunchTask": "tsc: build - tsconfig.json"
}
```

## Roadmap

- [x] Pagination and streaming batch fetching
- [x] Full nested resolver support
- [x] Hasura-style filtering
- [ ] Mutations for selected domains
- [ ] Caching and persisted queries

## License

MIT

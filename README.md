# TFE GraphQL

TFE GraphQL is a GraphQL interface for interacting with the Terraform Enterprise (TFE) and HCP Terraform (TFC) REST API. It enables clients to query TFE data using a flexible and powerful GraphQL schema, with support for filtering, nested relationships, pagination, rate-limiting, and request batching and management.

## Features

- 🚀 GraphQL interface over the TFE REST API
- 🔍 Advanced Hasura-style filtering
- 🌊 Streaming pagination for efficient retrieval of pages
- 🔐 TFC token-based authentication
- ⏳ Rate limit protection with exponential backoffs
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
TFC_TOKEN=<your-tfc/e-token>           # REQUIRED
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

| File            | Description                                |
|------------------|--------------------------------------------|
| `schema.ts`      | GraphQL schema for that domain.  Uses graphql-tag syntax in gql blocks             |
| `resolvers.ts`   | Resolver logic                             |
| `types.ts`       | TypeScript types and domain models         |
| `dataSource.ts`  | REST API integration layer                 |

## Usage

### Example Query

"Get me all the runs for the prod workspace or runs from any locked workspace

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
  "type": "node",
  "request": "launch",
  "name": "Debug TFE GraphQL",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/dist/index.js",
  "preLaunchTask": "tsc: build - tsconfig.json"
}
```

## Roadmap

- [✅] Pagination and streaming batch fetching
- [✅] Full nested resolver support
- [✅] Hasura-style filtering   
- [ ] Unit testing
- [ ] Mutations for selected domains
- [ ] Caching and persisted queries


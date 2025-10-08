# Getting Started with TFCE GraphQL

Welcome to the comprehensive guide for getting started with the **TFCE GraphQL** project.

This guide will walk you through installation, configuration, and basic usage of the TFCE GraphQL API.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Installation and Setup](#installation-and-setup)
   - [Prerequisites](#prerequisites)
   - [Clone the Repository](#clone-the-repository)
   - [Environment Variables](#environment-variables)
3. [Running the Server](#running-the-server)
4. [Exploring the API](#exploring-the-api)
5. [Basic Queries](#basic-queries)
   - [List Organizations](#list-organizations)
   - [List Teams](#list-teams)
6. [Filtering Data](#filtering-data)
7. [Nested Queries](#nested-queries)
8. [Rate Limit Handling](#rate-limit-handling)
9. [Sample Query: Workspace Runs](#sample-query-workspace-runs)
10. [Resources](#resources)

---

## Project Overview

The **TFCE GraphQL** project provides a flexible GraphQL API for interacting with Terraform Cloud and Terraform Enterprise resources, including organizations, teams, workspaces, runs, and more. It wraps the underlying REST API, exposing a strongly typed schema with advanced filtering, rate-limit handling, and streaming pagination under the hood.

---

## Basic Drive with Docker

```bash
docker run -p 4000:4000 ghcr.io/jeremymefford/tfce-graphql:latest
export JWT=$(curl -s -H "content-type: application/json" -X POST http://localhost:4000/auth/token -d '{"tfcToken":"<token>"}' | jq -r '.token')
curl -s -X POST -H "content-type: application/json" -H "Authorization: Bearer $JWT" http://localhost:4000/ \
  -d '{"query":"query { me { username } }"}'
```

## Installation and Setup

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Docker** (optional for containerized deployment)
- A **Terraform Cloud/Enterprise** account with an API token

Verify your environment:

```bash
node -v
npm -v
```

### Clone the Repository

```bash
git clone https://github.com/jeremymefford/tfce-graphql.git
cd tfce-graphql
```

### Environment Variables

Create a `.env` file in the project root with the following (customize as needed):

```env
TFCE_JWT_ENCRYPTION_KEY=$(openssl rand -base64 32) # stable JWTs across restarts
TFCE_AUTH_TOKEN_TTL=2600000
TFE_BASE_URL=https://app.terraform.io/api/v2  # normalized to include /api/v2
PORT=4000
# Logging
# LOG_LEVEL=info          # fatal,error,warn,info,debug,trace (default: info)
# NODE_ENV=development    # pretty-prints logs in development
# Optional tuning:
# TFCE_GRAPHQL_BATCH_SIZE=10
# TFCE_GRAPHQL_PAGE_SIZE=100
# TFCE_GRAPHQL_RATE_LIMIT_MAX_RETRIES=50
# TFCE_GRAPHQL_SERVER_ERROR_MAX_RETRIES=20
# TFCE_GRAPHQL_SERVER_ERROR_RETRY_DELAY=60000
# TFCE_GRAPHQL_REQUEST_CACHE_MAX_SIZE=5000
```

Tokens for Terraform Cloud/Enterprise are now supplied per-request when you exchange them for a JWT (details below), so they no longer live in the environment.

---

## Running the Server

Install dependencies and start:

```bash
npm install
npm start
```

Alternatively, build and run with Docker:

```bash
npm run docker:build
docker run -p 4000:4000 --env-file .env tfce-graphql
```

The API will be available at `http://localhost:4000/graphql`.

### Exchange a TFC Token for a JWT

Every GraphQL request must include a JWT issued by the server. Exchange your Terraform API token by calling the auth endpoint:

```bash
curl -X POST http://<endpoint>/auth/token \
  -H 'content-type: application/json' \
  -d '{"tfcToken":"<your terraform api token>"}'
```

The response contains an encrypted token and expiration timestamp:

```json
{ "token": "<jwe>", "expiresAt": "2025-02-07T18:21:34.000Z" }
```

Include the token in the `Authorization` header for all GraphQL calls:

```bash
curl http://<endpoint>/graphql \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer <jwe>' \
  --data '{"query":"{ __typename }"}'
```

Using Apollo Explorer? Add a preflight script so the UI automatically exchanges the Terraform token you store in its environment (`tfcToken`) and sets the `Authorization` header:

```js
const token = explorer.environment.get("tfcToken");

const resp = await explorer.fetch('http://<endpoint>/auth/token', {
  method: 'POST',
  headers: {'content-type': 'application/json'},
  body: `{"tfcToken":"${token}"}`
});

const jwt = (await resp.json()).token;

explorer.environment.set("JWT", jwt);
```

Then set your authorization header to `Bearer {{JWT}}`

---

## Exploring the API

Open the GraphQL playground at:

```
http://localhost:4000/graphql
```

Use the **Docs** tab in the playground to browse available queries, types, and filter operators.

---

## Basic Queries


### List Organizations

```graphql
query {
  organizations {
    id
    name
    email
    createdAt
  }
}
```

### List Teams

```graphql
query {
  teams(organization: "my-org") {
    id
    name
    usersCount
  }
}
```

### List Workspaces

```graphql
query {
  workspaces(includeOrgs: ["my-org"]) {
    id
    name
    locked
    description
  }
}
```

### List Projects

```graphql
query {
  projects(organization: "my-org") {
    id
    name
  }
}
```

### List Variable Sets

```graphql
query {
  variableSets(organization: "my-org") {
    id
    name
    varCount
  }
}
```

### List Variables

```graphql
query {
  variables(organization: "my-org", workspaceName: "my-workspace") {
    id
    key
    value
  }
}
```

---

## Filtering Data

Use the `filter` argument to narrow results. For example, fetch workspaces named “prod-app”:

```graphql
query {
  workspaces(includeOrgs: ["my-org"], filter: { name: { _eq: "prod-app" } }) {
    id
    name
    locked
  }
}
```

See the [Concepts](Concepts/) page for filter operators.

---

## Nested Queries

GraphQL supports nested relationships in a single request:

```graphql
query {
  organizations {
    name
    teams(filter: { name: { _ilike: "%dev%" } }) {
      name
      users(filter: { username: { _eq: "alice" } }) {
        id
        username
      }
    }
  }
}
```

---

## Rate Limit Handling

TFCE GraphQL automatically handles Terraform API rate limits and server errors with retries. You can configure retry settings via environment variables:

- `TFCE_GRAPHQL_RATE_LIMIT_MAX_RETRIES`
- `TFCE_GRAPHQL_SERVER_ERROR_MAX_RETRIES`
- `TFCE_GRAPHQL_SERVER_ERROR_RETRY_DELAY`

Refer to the [Concepts](Concepts/) page for details on rate-limit strategies.

---

## Sample Query: Workspace Runs

```graphql
query {
  workspace(id: "workspace-id") {
    id
    name
    runs(filter: { status: { _eq: "planned" } }) {
      id
      status
      createdAt
    }
  }
}
```

---

## Resources

- [Terraform Cloud API Documentation](https://www.terraform.io/cloud-docs/api)
 - Logging & tracing: The server emits structured logs with `trace_id` and `span_id`, and propagates `traceparent`/`x-request-id` on outbound calls.
- [TFCE GraphQL Concepts](Concepts/)
- [Implementation Status](implementation-status)
- [Contributing Guide](Contributing/)
- [Full Schema Reference (playground)](http://localhost:4000/graphql)

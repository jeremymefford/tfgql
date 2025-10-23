# Getting Started with TFGQL

Welcome to the comprehensive guide for getting started with the **TFGQL** project.

This guide will walk you through installation, configuration, and basic usage of the TFGQL API.

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

The **TFGQL** project provides a flexible GraphQL API for interacting with Terraform Cloud and Terraform Enterprise resources, including organizations, teams, workspaces, runs, and more. It wraps the underlying REST API, exposing a strongly typed schema with advanced filtering, rate-limit handling, and streaming pagination under the hood.

:::tip
Curious how this compares to a shell script that calls the REST API?  Check out the [comparison page](Concepts/direct-vs-graphql.md)
:::

---
# No Frills Starter

## Basic Drive with Docker

:::warning
Do not forget to replace `token` in this script with your actual token!
:::

```bash
docker run -p 4000:4000 ghcr.io/jeremymefford/tfgql:latest
TFC_TOKEN=<token> JWT=$(curl -s -H "content-type: application/json" -X POST http://localhost:4000/auth/token -d "{\"tfcToken\":\"$TFC_TOKEN\"}" | jq -r '.token')
curl -s -X POST -H "content-type: application/json" -H "Authorization: Bearer $JWT" http://localhost:4000/ \
  -d '{"query":"query { me { username } }"}'
```

---

## Exploring the API

Open the GraphQL playground at:

```
http://localhost:4000/graphql
```
:::warning
Read [this](#exchange-a-tfc-token-for-a-jwt) to learn how to setup the authentication for the requests 
in the explorer
:::


## Installation and Setup

### Prerequisites

- **Node.js** (version 20 or higher)
- **npm** 
- **Docker** (optional for containerized deployment)
- A **Terraform Cloud/Enterprise** account with an API token

Verify your environment:

```bash
node -v
npm -v
```

### Clone the Repository

```bash
git clone https://github.com/jeremymefford/tfgql.git
cd tfgql
```

### Environment Variables

Export the required environment variables in your shell (or add them to your profile) before starting the server:

```bash
export TFGQL_JWT_ENCRYPTION_KEY="$(openssl rand -base64 32)" # stable JWTs across restarts
export TFGQL_AUTH_TOKEN_TTL=2600000
export TFE_BASE_URL=https://app.terraform.io/api/v2  # normalized to include /api/v2
export PORT=4000
# Optional logging
# export LOG_LEVEL=info          # fatal,error,warn,info,debug,trace (default: info)
# export NODE_ENV=development    # pretty-prints logs in development
# Optional tuning:
# export TFGQL_BATCH_SIZE=10
# export TFGQL_PAGE_SIZE=100
# export TFGQL_RATE_LIMIT_MAX_RETRIES=50
# export TFGQL_SERVER_ERROR_MAX_RETRIES=20
# export TFGQL_SERVER_ERROR_RETRY_DELAY=60000
# export TFGQL_REQUEST_CACHE_MAX_SIZE=5000
```

Tokens for Terraform Cloud/Enterprise are now supplied per-request when you exchange them for a JWT (details below), so they no longer live in the environment.

---

## Running the Server

### Option 1: Run the prebuilt binary (macOS, Linux, Windows)

Download the archive that matches your platform from the latest
[GitHub release](https://github.com/jeremymefford/tfgql/releases), extract it,
and run the binary directly:

```bash
tar -xzf tfgql-linux-x64.tar.gz
./tfgql-linux-x64
```

Set the same environment variables shown above before starting the process. The
binary listens on `http://0.0.0.0:${PORT:-4000}`.

> **macOS**: Apple requires binaries to be signed. Release artifacts are
> shipped with an ad-hoc signature, so you can run them immediately. If you
> modify the binary, re-sign it with:
>
> ```bash
> codesign --sign - --force --deep ./tfgql-darwin-arm64
> ```

> **Windows**: Extract the `.tar.gz` with PowerShell (`tar -xf` is available by
> default) and run `tfgql-win-x64.exe` from a Command Prompt or PowerShell. The
> same environment variables apply.

### Option 2: Run with Node.js

Install dependencies and start:

```bash
npm install
npm start
```

### Option 3: Run with Docker

Alternatively, build and run with Docker:

```bash
npm run docker:build
docker run -p 4000:4000 \
  -e TFGQL_JWT_ENCRYPTION_KEY="$TFGQL_JWT_ENCRYPTION_KEY" \
  -e TFGQL_AUTH_TOKEN_TTL="$TFGQL_AUTH_TOKEN_TTL" \
  -e TFE_BASE_URL="$TFE_BASE_URL" \
  -e PORT=4000 \
  tfgql
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

#### Apollo explorer authentication setup

##### Step 1
To use preflight scripts, you need to sign up for a free apollo dev account. Click your profile pic in the top right to start
that flow or try to save the page and it should prompt you to create or log in.

##### Step 2
Add your TFC/E token in your apollo environment

![Apollo explorer env setup](./assets/envvar.png)

##### Step 3
Add a preflight script so the UI automatically exchanges the TFC/E token with a JWT:

![Apollo Explorer Preflight Setup](./assets/preflight.png)

:::warning
Don't forget to replace `<endpoint>` with your actual endpoint, typically `localhost:4000` 
:::
:::tip
Make sure to use a stable `TFGQL_JWT_ENCRYPTION_KEY` in your local environment if using this preflight script so that your tokens are valid across restarts of the application.
:::

```js
const expiry = explorer.environment.get("jwtExpiry");

if (!expiry || Date.now() > new Date(expiry).getTime()) {
  console.log("JWT expired, fetching new one");

  const tfcToken = explorer.environment.get("tfcToken");

  const resp = await explorer.fetch('http://localhost:4000/auth/token', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({tfcToken})
  });


  const authResponse = await resp.json();

  explorer.environment.set("JWT", authResponse.token);
  explorer.environment.set("jwtExpiry", authResponse.expiresAt);
}
```

##### Step 4
Add the `Authorization` header to each new tab

![Apollo Explorer Preflight Setup](./assets/header.png)


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

TFGQL automatically handles Terraform API rate limits and server errors with retries. You can configure retry settings via environment variables:

- `TFGQL_RATE_LIMIT_MAX_RETRIES`
- `TFGQL_SERVER_ERROR_MAX_RETRIES`
- `TFGQL_SERVER_ERROR_RETRY_DELAY`

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
- [TFGQL Concepts](Concepts/)
- [Contributing Guide](Contributing/)
- [Full Schema Reference (playground)](http://localhost:4000/graphql)

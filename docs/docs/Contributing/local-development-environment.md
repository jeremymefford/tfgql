# Local Development

## Installation and Setup

### Prerequisites

- **Node.js** (version 24 or higher)
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

Export the required environment variables in your shell (or add them to your profile) before starting the server

```bash
export TFGQL_JWT_ENCRYPTION_KEY="$(openssl rand -base64 32)" 
export LOG_LEVEL=debug
export NODE_ENV=development
```
:::tip
The full list of environment variables can be found [here](Deployment/runtime-configuration.md)
:::

---

## Running the Server

Install dependencies, prime your environment, and start:

```bash
npm install
npm start
```

The GraphiQL IDE will be available at `http://localhost:4000/`. The GraphQL endpoint itself is at `http://localhost:4000/graphql`.

---

## Build and deploy docs locally

The contribution guideline also expects that any changes will update relevant docs.  A pull request cannot be merged if the docs don't build locally.  Make sure the docs build and look correct before opening a PR.

```bash
cd docs/
npm run build
npm run serve
```
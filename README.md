# TFC/E GraphQL Facade (TFGQL)

TFGQL exposes Terraform Cloud and Terraform Enterprise data through a single GraphQL endpoint with request batching, filtering, and pagination built in.

## Documentation

### [Official docs](https://jeremymefford.github.io/tfgql/)

- Primary reference for deployment, usage, and contributing details.

## Quickstart

1. Install dependencies: `npm install`
2. Configure the required environment variables (see [runtime configuration docs](docs/docs/Deployment/runtime-configuration.md)); at minimum set `TFE_BASE_URL` for Terraform Enterprise instances.
3. Run the server: `npm start`

Node.js 20+ and a valid Terraform Cloud/Enterprise token are required.

## Authentication

The `/auth/token` endpoint validates your Terraform API token against TFC/E
before issuing a JWT; any 4xx response from Terraform is returned unchanged.

1. Exchange a Terraform API token for a session JWT:
   ```bash
   curl -X POST http://<endpoint>/auth/token \
     -H 'content-type: application/json' \
     -d '{"tfcToken":"<terraform-api-token>"}'
   ```
   This will return:
   ```json
   {"token":"<JWT>","expiresAt":"<ISO Date>"}
   ```
2. Call GraphQL with the returned JWT:
   ```bash
   curl http://<endpoint>/graphql \
     -H 'content-type: application/json' \
     -H 'authorization: Bearer <JWT>' \
     --data '{"query":"{ __typename }"}'
   ```

For end-to-end examples, schema guides, and deployment recipes, continue in the docs site.

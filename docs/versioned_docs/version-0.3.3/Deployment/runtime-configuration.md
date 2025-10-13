# Runtime Configuration

TFCE GraphQL is configured entirely through environment variables so it can
deploy cleanly across local development, containers, and platforms such as
Terraform Cloud Agents. The table below lists every supported variable along
with defaults and notes about when they are required.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `TFCE_JWT_ENCRYPTION_KEY` | Symmetric key used to encrypt issued JWTs. Provide a 32-byte Base64/hex string for stable tokens. | — | ❌ (auto-generated in-memory when omitted) |
| `TFCE_AUTH_TOKEN_TTL` | JWT lifetime (seconds). Controls how long exchanged Terraform tokens remain valid. | `3600` | ❌ |
| `TFE_BASE_URL` | Base URL for the Terraform API. Automatically normalized to end with `/api/v2`. | `https://app.terraform.io/api/v2` | ❌ |
| `TFCE_GRAPHQL_BATCH_SIZE` | Maximum concurrency for GraphQL-side batching. | `10` | ❌ |
| `TFCE_GRAPHQL_PAGE_SIZE` | Maximum items requested per page from Terraform APIs. | `100` (max: 100) | ❌ |
| `TFCE_GRAPHQL_RATE_LIMIT_MAX_RETRIES` | Retries after HTTP 429 responses. | `50` | ❌ |
| `TFCE_GRAPHQL_SERVER_ERROR_MAX_RETRIES` | Retries after upstream 5xx responses. | `20` | ❌ |
| `TFCE_GRAPHQL_SERVER_ERROR_RETRY_DELAY` | Delay (ms) between 5xx retries. | `60000` | ❌ |
| `TFCE_GRAPHQL_REQUEST_CACHE_MAX_SIZE` | Maximum entries in the per-request cache. | `5000` | ❌ |
| `TFCE_GRAPHQL_DISABLE_EXPLORER` | Disable the Apollo Explorer landing page when set to `true`. | `false` | ❌ |
| `TFCE_SERVER_TLS_CERT_FILE` | Path to PEM-encoded certificate (and chain) for HTTPS termination. See [TLS deployment guidance](./tls). | — | ❌ |
| `TFCE_SERVER_TLS_KEY_FILE` | Path to PEM-encoded private key for HTTPS termination. | — | ❌ |
| `TFCE_SERVER_TLS_CA_FILE` | Optional PEM bundle for client auth / certificate chain. | — | ❌ |
| `TFCE_SERVER_TLS_KEY_PASSPHRASE` | Optional passphrase for the HTTPS private key. | — | ❌ |
| `LOG_LEVEL` | Pino log level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`). | `info` | ❌ |
| `NODE_ENV` | Node environment; `development` enables pretty logs. | — | ❌ |

## Usage Tips

- Store sensitive values such as `TFCE_JWT_ENCRYPTION_KEY` in a secrets manager
  or inject them at deploy time rather than committing them to source control.
- During local development, create a `.env` file in the repository root and load
  it with a tool like [`direnv`](https://direnv.net/) or the VSCode
  [dotenv](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
  extension.
- TLS configuration is optional unless you want the Node.js process to terminate
  HTTPS connections directly; see [`Deployment/tls`](./tls) for details.
- When deploying in container environments, pass the variables via `--env-file`
  (as shown in [`Deployment/docker`](./docker)) or your platform-specific secret
  management solution.

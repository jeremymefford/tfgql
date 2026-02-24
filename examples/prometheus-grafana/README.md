# TFGQL Prometheus + Grafana Example

This example deploys:

- `tfgql` built from this repository's `Dockerfile`
- Prometheus scraping `tfgql` at `/metrics`
- Grafana pre-provisioned with a `TFGQL Metrics Overview` dashboard

## Prerequisites

- Docker + Docker Compose
- `jq` (for token minting command)
- A Terraform Cloud / Enterprise API token

## 1) Start `tfgql`

From this folder:

```bash
docker compose up -d tfgql
```

## 2) Mint and store a JWT for Prometheus

```bash
read -rsp "Terraform token: " TFC_TOKEN; echo
mkdir -p prometheus/secrets
TFGQL_TOKEN=$(
  curl -fsS -X POST http://127.0.0.1:4000/auth/token \
    -H 'content-type: application/json' \
    -d "{\"tfcToken\":\"${TFC_TOKEN}\",\"infinite\":true}" \
  | jq -r '.token'
)
printf '%s' "$TFGQL_TOKEN" > prometheus/secrets/.env
```

## 3) Start Prometheus + Grafana

```bash
docker compose up -d
```

## 3) Open UIs

- tfgql: `http://127.0.0.1:4000`
- Prometheus: `http://127.0.0.1:9090`
- Grafana: `http://127.0.0.1:3000`
  - username: `admin`
  - password: `admin`

## Notes

- Prometheus scrapes the `tfgql` Compose service directly at `tfgql:4000`.
- The example uses a default `TFGQL_JWT_ENCRYPTION_KEY`; override it for non-demo usage.
- To rotate token auth after expiry/revocation, rewrite `prometheus/secrets/.env` and restart Prometheus:
  `docker compose restart prometheus`

# TLS Guidance

This service assumes TLS is handled by the platform whenever possible. The
information below explains the supported options and the trade-offs involved.

## Outbound TLS trust

The Node.js runtime trusts the operating system certificate store inside the
container image. If you need to trust additional enterprise certificate
authorities (for example, to reach an internal Terraform Enterprise domain),
you must extend the container image and add those certificates to the system
trust store. A typical pattern is:

1. Copy your PEM bundle into the image (for example, `/usr/local/share/ca-certificates/company.crt`).
2. Run the appropriate trust-store refresh command for the base image (for
   Debian/Ubuntu images this is `update-ca-certificates`).
3. Rebuild/push the image and run this GraphQL server from that derivative
   image.

The application does not accept runtime environment variables for outbound TLS
trust. Managing the store at the image layer keeps the behaviour consistent for
every process inside the container and avoids configuration drift.

## In-process HTTPS termination (optional)

By default the server listens with plain HTTP. If your deployment requires the
Node.js process to terminate TLS directly, provide PEM-encoded artifacts via the
following environment variables:

- `TFCE_SERVER_TLS_CERT_FILE` – certificate (and intermediate chain)
- `TFCE_SERVER_TLS_KEY_FILE` – private key for the certificate
- `TFCE_SERVER_TLS_CA_FILE` (optional) – additional CA bundle to present to clients
- `TFCE_SERVER_TLS_KEY_PASSPHRASE` (optional) – key passphrase

When these variables are set, the server starts an HTTPS listener that enforces
TLS 1.3 with a restricted cipher suite (`TLS_AES_256_GCM_SHA384`,
`TLS_CHACHA20_POLY1305_SHA256`, `TLS_AES_128_GCM_SHA256`). Connections are served
over HTTP/1.1.

> **Important:** Terminating TLS inside the Node.js process adds measurable CPU
> overhead and removes the ability to reuse mature ingress features (caching,
> observability, certificate rotation, etc.). Only enable in-process TLS if
> policy absolutely requires it.

### Recommended deployment pattern

1. Terminate TLS at the nearest ingress or gateway (load balancer, API gateway,
   service mesh sidecar, etc.).
2. Forward traffic to this service over the trusted network segment.
3. If additional hop-to-hop TLS is mandated, prefer a mesh/sidecar solution so
   the Node.js process can remain HTTP-only.

Enabling HTTPS directly inside this application should be considered a fallback
for constrained environments, not the default deployment strategy.

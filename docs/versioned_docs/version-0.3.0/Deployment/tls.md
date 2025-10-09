---
title: TLS Options
description: Configure TLS for outbound trust and in-process HTTPS termination.
---

# TLS Options

> **Best practice:** terminate TLS at the platform edge (load balancer, service
> mesh, ingress) whenever possible. Use the in-process HTTPS mode only when
> policy requires the Node.js process to handle TLS directly.

This page explains how to extend the container image with additional trusted
certificate authorities and how to enable HTTPS inside the TFCE GraphQL server
when absolutely necessary.

## Extend the trust store for outbound calls

The runtime trusts the operating system store provided by the container image
(`node:alpine`). To trust internal or enterprise certificate authorities, build a
thin derivative image that copies your PEM bundle into the Alpine trust store
and runs `update-ca-certificates`.

```dockerfile title="Dockerfile"
# syntax=docker/dockerfile:1.7-labs
FROM ghcr.io/jeremymefford/tfce-graphql:latest

USER root
RUN apk add --no-cache ca-certificates
COPY internal-root-ca.pem /usr/local/share/ca-certificates/internal-root-ca.crt
RUN update-ca-certificates

# Drop back to the non-root runtime user configured by the base image
USER node
```

Build and push the image, then deploy as usual. Every process inside the
container (including Node.js and utilities like curl) now trusts the additional
CA bundle.

## Enable HTTPS inside the Node.js process (optional)

Provide PEM-encoded assets via the following environment variables:

- `TFCE_SERVER_TLS_CERT_FILE` – certificate (and intermediate chain)
- `TFCE_SERVER_TLS_KEY_FILE` – private key for the certificate
- `TFCE_SERVER_TLS_CA_FILE` (optional) – bundle to present to clients or use for
  mutual TLS
- `TFCE_SERVER_TLS_KEY_PASSPHRASE` (optional) – passphrase for the key

When both `TFCE_SERVER_TLS_CERT_FILE` and `TFCE_SERVER_TLS_KEY_FILE` are set, the
server listens with HTTPS, enforces TLS 1.3, and restricts ciphers to
`TLS_AES_256_GCM_SHA384`, `TLS_CHACHA20_POLY1305_SHA256`, and
`TLS_AES_128_GCM_SHA256`.

> ⚠️ In-process TLS increases CPU usage and removes the observability and
> rotation features provided by managed ingress stacks. Treat this mode as a
> fallback for constrained environments.

### Local testing

The repository includes a helper script you can source to generate test
certificates and define an alias that starts the server with HTTPS:

```bash
source ./generate-test-certs.sh
# Optionally pin the JWT encryption key for repeatable tokens
export TFCE_JWT_ENCRYPTION_KEY=$(openssl rand -base64 32)
start_tfce_tls
```

Trust `certs/test-ca.cert.pem` in your browser or HTTP client to avoid TLS
warnings.

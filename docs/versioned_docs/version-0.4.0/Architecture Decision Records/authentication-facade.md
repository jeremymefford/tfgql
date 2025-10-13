---
id: authentication-facade
title: ADR - Authentication Facade
sidebar_label: Authentication Facade
---

## Status

Accepted – 2025-02-14

## Context

Some operators of TFGQL require every service they deploy to enforce authentication, even when the downstream APIs already require credentials. Our initial prototype simply proxied the provided Terraform Cloud/Enterprise (TFC/E) token to the REST API. While functional, that design prevented the facade from doing anything more sophisticated than pass-through token handling:

- We could not distinguish or audit the caller of the GraphQL service itself.
- We could not introduce additional access controls, multi-tenancy, or rate limiting that depended on the identity of the GraphQL client.
- Revoking access to the GraphQL facade would require revoking the user’s underlying TFC/E token (which may be used for other tools).

## Decision

We introduced an authentication flow where the GraphQL facade exchanges the user-supplied TFC/E API token for a short-lived JWT issued by the service. Every GraphQL request must include this JWT, which the server decrypts and uses to retrieve the underlying TFC/E token when calling downstream APIs.

This approach keeps the downstream REST integrations unchanged while letting the facade apply its own authentication/authorization policies.

## Consequences

### Positive

- We can add future capabilities—such as user accounts, role-based access, or per-client quota enforcement—without modifying the TFC/E credentials themselves.
- The facade can maintain its own revocation list or audit trail independent of Terraform’s tokens.
- End users get a consistent experience across environments that require authentication on every service.

### Negative

- The authentication handshake adds an extra request before the first GraphQL call.
- We must manage encryption keys and key rotation for the JWTs we issue.
- The facade becomes responsible for secure storage and handling of decrypted TFC/E tokens during each request.

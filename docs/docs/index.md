# TFCE GraphQL

Welcome to the Terraform Cloud/Enterprise GraphQL API documentation.

Explore the sections below to get started:

- [Getting Started](Getting%20Started/getting-started)
- [Concepts](Concepts/)
- [Implementation Status](implementation-status)
- [Contributing](Contributing/)
- [Deployment](Deployment/docker)
- [Use Cases](Use%20Cases/use-cases)
- [Architecture Decision Records](Architecture%20Decision%20Records/)

## Recent Changes (last 30 days)

- Added Terraform version filtering operators (`_gt`, `_gte`, `_lt`, `_lte`, `_eq`, `_neq`, `_in`, `_nin`).
- PolicySets query now requires an `organization` argument: `policySets(organization: String!, ...)`.
- Renamed Team Access to Workspace Team Access throughout the API and docs.
- Hardened base URL configuration; `TFE_BASE_URL` is normalized to include `/api/v2`.
- Improved request-level cache with in-flight de-duplication and size capping.
- Enhanced HTTP resilience: retries for 5xx with configurable delay and retries; improved 429 handling.
- Observability: structured logging with `trace_id`/`span_id`, and automatic `traceparent` propagation.

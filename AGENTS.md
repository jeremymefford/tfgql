# AGENTS

This repository contains a TypeScript Apollo GraphQL server. These notes are for agents working inside this repo to keep changes consistent, safe, and easy to validate.  The project is a GraphQL facade over the Terraform Cloud / Terraform Enterprise APIs.

## Overview
- Runtime: Node.js + TypeScript
- GraphQL: Apollo Server v4 (`src/server/index.ts`, `src/server/schema.ts`)
- Schema composition: per-entity `schema.ts` + combined in `src/server/schema.ts`
- Logging: Pino + AsyncLocalStorage mixin (`src/common/logger.ts`)
- Tracing: W3C `traceparent` parsing/formatting (`src/common/trace.ts`)
- HTTP: Axios client + retries/propagation (`src/common/httpClient.ts`)

## Project Structure
- Entrypoints
  - `index.ts`: Node entry; calls `startServer()`.
  - `src/server/index.ts`: Apollo setup, request context creation, logging/trace binding.
  - `src/server/schema.ts`: Aggregates all entity schemas and resolvers; registers scalars.
- Common modules
  - `src/common/logger.ts`: Pino logger configured with AsyncLocalStorage mixin.
- `src/common/trace.ts`: Utilities for W3C trace context.
- `src/common/httpClient.ts`: Factory for constructing request-scoped Axios clients with retries and outbound header propagation.
  - `src/common/conf.ts`: Env config parsing and defaults.
  - `src/common/filtering/*`: Filter input schema and evaluation helpers.
  - `src/common/streamPages.ts`: Pagination streamer and `gatherAsyncGeneratorPromises`.
  - `src/common/fetchResources.ts`: Bounded concurrency over arbitrary iterables.
  - `src/common/concurrency/parallelizeBounded.ts`: Generic concurrency helper.
  - `src/common/types/jsonApi.ts`: JSON:API generic type helpers.
  - `src/common/middleware/*`: Apollo plugins and lightweight interfaces.
- Domain folders (one per entity): e.g., `src/workspaces`, `src/runs`, `src/users`, etc.
  - Each contains `types.ts`, `mapper.ts`, `dataSource.ts`, `schema.ts`, `resolvers.ts`.

## Run & Build
- Compile: `npm run compile`
- Start: `npm start` (compiles then runs `dist/index.js`)
- Tests: `npm test` (Vitest); `npm run coverage` for coverage
- Docker build: `npm run docker:build`

## Logging & Tracing
- Per-request fields are injected into every log via a Pino `mixin()` using AsyncLocalStorage.
- Injected fields (only): `trace_id`, `span_id`.
- `traceparent` is parsed from inbound requests or generated, and is used as the `x-request-id` value; it is not logged.
- Binding occurs in `src/server/index.ts` when building the request context.
- Apollo plugin `src/common/middleware/logging.ts` logs request start and errors.
- Guidelines
  - Use `context.logger` in resolvers; use shared `logger` in common utilities.
  - Do not attach trace fields manually; rely on the mixin.
  - Child loggers should only add domain bindings (e.g., `workspaceId`).

## HTTP Calls
- Use the request-scoped Axios client from the GraphQL context (`createHttpClient` in `src/common/httpClient.ts`). It provides:
  - Authorization header injection using the decrypted JWT token for the current request.
  - Outbound header propagation: sets `traceparent` and `x-request-id` (same value) from current request context.
  - Retry on 5xx (configurable): up to `TFCE_GRAPHQL_SERVER_ERROR_MAX_RETRIES`, with delay `TFCE_GRAPHQL_SERVER_ERROR_RETRY_DELAY` ms.
  - Retry on 429: uses `Retry-After` or `X-RateLimit-Reset`, capped at 60s, up to `TFCE_GRAPHQL_RATE_LIMIT_MAX_RETRIES`.
- Avoid creating bespoke Axios instances; rely on the factory so each request gets the correct auth/trace wiring.

## Configuration
- Source: `src/common/conf.ts` reads environment variables at startup.
- Optional (with defaults)
  - `TFE_BASE_URL`: API base; normalized to include `/api/v2` (default `https://app.terraform.io/api/v2`).
  - `TFCE_AUTH_TOKEN_TTL` (default 3600): lifetime (seconds) of issued JWTs.
  - `TFCE_JWT_ENCRYPTION_KEY`: Base64/hex/string used to derive AES key for JWT encryption. When omitted a random in-memory key is generated at startup.
  - `TFCE_GRAPHQL_BATCH_SIZE` (default 10): concurrency for GraphQL-side batching.
  - `TFCE_GRAPHQL_PAGE_SIZE` (default 100, max 100): TFE page size.
  - `TFCE_GRAPHQL_RATE_LIMIT_MAX_RETRIES` (default 50): 429 retries.
  - `TFCE_GRAPHQL_SERVER_ERROR_MAX_RETRIES` (default 20): 5xx retries.
  - `TFCE_GRAPHQL_SERVER_ERROR_RETRY_DELAY` (default 60000): delay ms between 5xx retries.
  - `TFCE_GRAPHQL_REQUEST_CACHE_MAX_SIZE` (default 5000): per-request cache entries.

## GraphQL Conventions
- Context: built per-request in `src/server/context.ts` with data sources, cache, and logger.
- Entity layout: each domain has `types.ts`, `mapper.ts`, `dataSource.ts`, `schema.ts`, `resolvers.ts`.
- Composition: `src/server/schema.ts` aggregates all typeDefs and resolvers.
- Scalar: `DateTime` provided by `src/common/scalars/dateTime.ts` (ISO-8601 UTC).
- Keep resolvers lean; put IO and pagination in data sources.

## Entity Conventions
- Files per entity
  - `types.ts`: Raw JSON:API response types and Domain types used by resolvers.
  - `mapper.ts`: `DomainMapper` implementation that converts API `attributes`/`relationships` to Domain type; no IO.
  - `dataSource.ts`: Outbound HTTP calls (via the context-provided Axios client), pagination with `streamPages`, optional `RequestCache` usage.
  - `schema.ts`: Default export GraphQL schema (using `gql`) defining types, queries, and filter inputs.
  - `resolvers.ts`: Query and type resolvers; keep side effects minimal and delegate to data sources.
- Naming and mapping
  - GraphQL types: PascalCase; fields camelCase.
  - Convert dashed/snake case from API to camelCase in mappers.
  - Convert timestamp strings to `Date` where applicable.
  - Store relationship IDs (e.g., `organizationName`) on the domain object for later resolution.
- Resolver patterns
  - List queries: return `gatherAsyncGeneratorPromises(dataSources.<API>.<list>(...))`.
  - Single fetches: return `null` on 404; throw others.
  - Nested list fields: accept `{ filter?: <Entity>Filter }` in the field args.
  - Use `parallelizeBounded` to examine related resources across a page while keeping concurrency bounded.

## Coding Guidelines
- Keep changes minimal, focused, and consistent with existing style.
- Avoid adding dependencies unless necessary.
- Prefer small, composable functions and clear names.
- Update or add concise docs where they add value.
- Do not include license headers unless requested.

## Testing & Validation
- Compile locally: `npm run compile` to catch TS errors.
- Run tests: `npm test` or `npm run coverage`.
- Add targeted tests only where the repo already tests that area (Vitest).

### Testing Patterns
- Resolver tests mock `Context.dataSources` and call resolver functions directly (see `tests/users/resolvers.test.ts`).
- Place tests under `tests/<entity>/`.
- Keep tests focused on observable behavior (mapping, filtering, resolver contract), not implementation details.

## Data Sources, Mappers, and Filtering
- Mappers (`mapper.ts`) convert JSON:API resources to domain types; they do not resolve nested entities.
- Data sources encapsulate all outbound calls and pagination (`streamPages`, `fetchResources`).
- Filtering
  - GraphQL filter inputs map to a flexible where-like system (`src/common/filtering`).
  - Use `evaluateWhereClause` in mappers/data sources only when post-filtering is needed after pagination.
  - Be careful with semver and date comparisons; see `filtering.ts` for behavior.
- Request cache (`src/common/requestCache.ts`)
  - Per-request cache with duplicate-in-flight suppression.
  - Use sparingly; keys must include all parameters that influence the result. Serialize filters stably when needed.
  - Suggested key format: `${entity}:${stableStringifiedParams}` where params include IDs and filter criteria.

## Concurrency & Pagination Utilities
- `streamPages`: async generator over paginated endpoints; respects `tfcPageSize` and returns mapped items in batches.
- `fetchResources`: runs operations over a collection with bounded concurrency and optional post-filtering.
- `parallelizeBounded`: generic bounded parallelism helper.

## Adding New Entities
- Follow the pattern described in docs at `docs/docs/Contributing/adding-a-new-entity.md`.
- Wire schema and resolvers into `src/server/schema.ts` and data source into `src/server/context.ts`.

## Error Handling
- 404s for single-resource GETs should return `null` in data sources rather than throw.
- Log meaningful context with `context.logger` and rely on mixin for trace fields.

## Repository Docs
- Additional docs live under `docs/` (Docusaurus). Useful entries:
  - Getting Started: `docs/docs/Getting Started/getting-started.md`
  - Deployment: `docs/docs/Deployment/docker.md`
  - Concepts & ADRs: `docs/docs/Concepts/concepts.md`, `docs/docs/Architecture Decision Records/`

## Useful Paths
- Logger config: `src/common/logger.ts`
- Trace utils: `src/common/trace.ts`
- Axios client: `src/common/httpClient.ts`
- Server entry: `src/server/index.ts`
- Apollo plugin: `src/common/middleware/logging.ts`

## Do / Don’t
- Do: use `context.logger` in resolvers and `logger` in shared utils.
- Do: rely on mixin for `trace_id`/`span_id`.
- Don’t: log `traceparent` or `trace_flags` directly; infer as needed.
- Don’t: duplicate `trace_id`/`span_id` in child logger bindings.
- Don't: make changes to lines not directly in scope of the required changes.  For example, do not change "" to '' on another line just because '' may fit better.

---
Scope: Root-level instructions apply to the whole repo. If a more specific `AGENTS.md` is added in a subdirectory later, it takes precedence within that subtree.

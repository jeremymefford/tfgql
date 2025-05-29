# Concepts

This page covers key architectural and functional concepts behind `tfce-graphql`. Understanding these foundational elements will help you write performant and scalable queries using this tool.

---

## Parallelization

`tfce-graphql` employs intelligent parallelization to accelerate data fetching while maintaining control over concurrency. This is essential when interfacing with APIs like HCP Terraform and TFE, which can become bottlenecked by sequential requests.

### Concurrency Control

Parallelization is governed by the `applicationConfiguration.graphqlBatchSize` parameter, which defines the maximum number of in-flight operations at any given time. This ensures we maintain high throughput without overwhelming the API or violating rate limits.

### Batching Strategies

The system implements a streaming loop pattern using async generators and bounded concurrency. Each data source uses `parallelizeBounded`—a utility that accepts an iterable of async operations and executes them while respecting the configured concurrency ceiling.

### Concurrency Utilities

Two framework level functions exist to assist:

- `parallelizeBounded`: Runs operations concurrently with a concurrency cap.
- `streamPages`: Streams paginated API resources item-by-item.

### Benefits

- Faster data aggregation
- Non-blocking resolution of large collections
- Efficient use of bandwidth and client compute resources

---

## Pagination

Most Terraform API endpoints implement pagination. To support seamless traversal, `tfce-graphql` provides pagination-aware data source utilities that can stream results across pages.

### Streaming Pages

The `streamPages` utility abstracts away manual pagination handling. It lazily yields items one-by-one using a `for await...of` loop, transparently fetching the next page when needed.

Example:

```ts
for await (const workspace of streamPages(
  (page) => this.getWorkspacesPage(page),
)) {
  // Handle workspace
}
```

### Benefits

- Works well with large datasets
- Avoids exhausting memory
- Works naturally with GraphQL resolvers that expect streams

---

## Rate Limiting

Rate limits are a fundamental reality of working with APIs like HCP Terraform and TFE. `tfce-graphql` implements client-side rate limit protection to avoid abuse and maximize throughput.

### Mechanisms

- **Rate Limiter Awareness**: Each request tracks headers like `X-RateLimit-Remaining`.
- **Request Spacing**: Requests are paused or throttled when the system detects limits are near exhaustion.
- **Retry Strategies**: Certain APIs are backed off using `Retry-After` hints when returned by the server.

### Responsible Client Behavior

By handling rate limits gracefully, we avoid:

- Getting blocked
- Triggering API-wide slowdowns
- Losing reliability in long-running processes

---

## Entity Graph

Unlike RESTful systems where objects are queried independently, `tfce-graphql` exposes the entire Terraform Enterprise/HCP domain model as an entity graph.

### Resolver Design

Each entity (e.g., `organizations`, `teams`, `workspaces`, etc.) has its own resolver layer that manages:

- Data fetching
- Relationship resolution
- Filtering logic

Resolvers are registered using a `registerResolver` utility that enables nested querying across relationships.

### Relationship Chaining

For example, this query walks the graph from `organizations` to `teams` to `users`:

```graphql
query {
  organizations {
    teams {
      users {
        username
      }
    }
  }
}
```

This pattern enables expressive, deeply nested queries that mirror how users actually work with Terraform resources.

---

## Request-Level Cache

To support high-performance querying and avoid redundant fetches, `tfce-graphql` uses a request-level cache.

### Features

- Shared across resolvers for a single query execution
- Keyed by entity type and ID
- Supports async resolution and caching with `getOrSet`

This cache enables deduplication of operations like:

- Fetching the same user multiple times in a single request
- Resolving an entity once for `where` and again for `query`

---

## Filter Clause

Applies filters to the *current* entity. This is applied synchronously using scalar attributes (e.g., `username`, `id`, etc).

```graphql
users(filter: { username: { _eq: "alice" } }) {
  id
  username
}
```
---

## Strongly Typed Filtering

Each entity has a corresponding `*Filter` type, and those are recursively composed.

Example:

```graphql
input TeamFilter {
  name: StringComparisonExp
  users: UserFilter
}
```

This allows for expressive, nested filtering.
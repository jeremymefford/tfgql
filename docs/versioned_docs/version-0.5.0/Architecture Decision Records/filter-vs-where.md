# ADR: Deprecating `where` Clauses in Favor of `filter`

## Status

Shelved

## Context

Originally, the `where` clause was introduced as a mechanism to enable deep, nested filtering of related entities—similar to Hasura's GraphQL filtering model. This provided a powerful way to express queries like:

```graphql
query {
  organizations {
    teams(where: { users: { username: { _eq: "alice" } } }) {
      name
      users(filter: { username: { _eq: "alice" } }) {
        id
        username
      }
    }
  }
}
```

This structure aimed to allow filtering not only at the current entity level (`filter`) but also on nested relationships (`where`). While the concept proved useful for expressing complex queries, the implementation created significant complexity due to a few core issues:

1. **High Coupling to Resolution Order:** The `where` clause required nested entity resolvers to be invoked eagerly and out of natural traversal order. This led to brittle coupling between resolvers and an implicit contract on when and how nested data would be fetched.

2. **Convention-Heavy Assumptions:** To support this, a resolver registry and context-aware resolution map were built, but the system still had to rely heavily on conventions to know what to resolve and how to map values. The disconnect between GraphQL schema types and internal domain types made this especially error-prone.

3. **Poor Debuggability and Maintainability:** When queries failed to behave as expected, debugging why a nested `where` clause didn’t apply was difficult. Filters, by contrast, could be evaluated at the point of data access and followed a predictable structure.

4. **Partial Filtering Expectations:** The `where` clause's presence in parent resolvers didn't naturally translate to filtering nested response payloads unless duplicated in the nested `filter` clause. This caused confusion around intent and behavior.

## Decision

We are shelving support for `where` clauses as part of our GraphQL resolver and filtering strategy.

All filtering logic will instead be handled via `filter` clauses that operate directly on the currently resolved entity, without influencing upstream or downstream resolvers.

For nested entity filtering, users must explicitly query those fields and apply a `filter` clause directly at the point of usage. This preserves clarity and allows lazy resolution without risk of inconsistent application behavior.

## Consequences

- Simplifies the resolution lifecycle and avoids forcing premature resolution of related entities.
- Eliminates reliance on implicit conventions and fragile resolver chaining.
- Filtering logic remains composable and easier to debug.
- Certain deeply nested filters will require more verbose queries with repeated `filter` clauses, but that is a worthwhile trade-off for maintainability and clarity.

## Alternatives Considered

We explored:

- Resolver registry-based resolution graph traversal
- Auto-detection of necessary relationships via query inspection
- Enhancing domain mappers to carry reverse references

Each added unnecessary complexity or created brittle edge cases, especially when reconciling schema types with runtime data shape.

## Final Notes

If future needs arise where true nested resolution filtering becomes essential, a redesigned approach will be revisited that treats relationships as first-class entities with explicit resolution boundaries and caching.
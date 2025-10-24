---
title: Filtering Reference
description: Detailed reference for building `filter` arguments in TFGQL queries.
---

TFGQL exposes a consistent filtering system across every entity. Each GraphQL `filter` input ultimately resolves to a `WhereClause<T>` that is evaluated by the utility in `src/common/filtering/filtering.ts`. The same operators are available everywhere, so once you learn the patterns you can reuse them for runs, workspaces, teams, and nested relations.

This guide documents every supported operator, explains how data types are handled, and provides practical examples.

## Core structure

A filter is a JSON-like object that combines *logical operators* (`_and`, `_or`, `_not`) with *field comparisons*. GraphQL input types mirror this structure. For example, the `RunFilter` input contains optional fields such as `status`, `workspace`, `createdAt`, etc. Each field accepts the comparison expression appropriate for its underlying type.

```graphql
query RunsByStatus($filter: RunFilter) {
  runs(filter: $filter) {
    id
    status
  }
}

# variables
{
  "filter": {
    "status": { "_in": ["applied", "planned_and_finished"] },
    "createdAt": { "_gte": "2025-01-01T00:00:00Z" }
  }
}
```

The example above shows a top-level filter combining multiple field comparisons (`status`, `createdAt`). Logical operators can wrap any expression:

```graphql
{
  "filter": {
    "_or": [
      { "status": { "_eq": "applied" } },
      {
        "_and": [
          { "status": { "_eq": "planned_and_finished" } },
          { "createdAt": { "_lt": "2024-06-01T00:00:00Z" } }
        ]
      }
    ]
  }
}
```

This can be translated to the English sentence: "Give me all runs that have either applied or finished a plan before June '24"

## Comparison operators by type

| Type | Operators |
| --- | --- |
| String | `_eq`, `_neq`, `_in`, `_nin`, `_like`, `_nlike`, `_ilike`, `_nilike`, `_is_null` |
| Integer / Float | `_eq`, `_neq`, `_in`, `_nin`, `_gt`, `_gte`, `_lt`, `_lte`, `_is_null` |
| Boolean | `_eq`, `_neq`, `_is_null` |
| Date / DateTime | `_eq`, `_neq`, `_in`, `_nin`, `_gt`, `_gte`, `_lt`, `_lte`, `_is_null` |
| Terraform versions | Same as string plus `_gt`, `_gte`, `_lt`, `_lte` (semantic version aware) |

All comparison operators accept JSON scalar values. `_in` and `_nin` expect arrays. `_is_null` is a boolean and may be combined with other operators.

### String operators

- `_like` / `_nlike` perform SQL-style wildcard matching (`%` matches zero or more characters, `_` matches a single character) with case sensitivity.
- `_ilike` / `_nilike` behave the same but compare in lowercase.
- `_eq` / `_neq` and `_in` / `_nin` are exact matches.

### Numeric operators

- Comparisons are strict (`_gt` means strictly greater than, `_gte` means greater than or equal to, etc.).
- `_in` / `_nin` require arrays of numbers and are evaluated using strict equality.

### Boolean operators

- Only `_eq`, `_neq`, and `_is_null` are meaningful. Combining `_is_null: true` with `_eq` is allowed (and effectively a no-op if `_eq` is also `null`).

### Date and DateTime

- Strings are parsed with `Date.parse`. The helper accepts ISO-8601 strings and native JavaScript `Date` objects. If the value cannot be parsed, the filter returns `false` and skips the record.
- `_in` / `_nin` compare timestamps to millisecond precision.

### Terraform CLI versions

- The helper understands semver-style strings such as `1.6.1`, `v1.4`, or prefixed expressions (`>= 1.5`).
- `_in` / `_nin` still behave as string membership checks.
- Terraform CLI version can be named any string, so if the string doesn't look like a version number, it is ignored (dropped) when filtering

## Logical operators

| Operator | Description |
| --- | --- |
| `_and` | All subclauses must match. Receives an array of filter objects. |
| `_or` | Any subclause may match. Receives an array of filter objects. |
| `_not` | Negates the enclosed filter. Accepts a single filter object. |

Logical operators can wrap one another at any depth. The evaluation helper uses short-circuit logic to avoid unnecessary comparisons.

## Nested filters

A comparison value can itself be a `WhereClause`. When the resolver encounters a plain object for a field (and that field resolves to an object in the domain model) it calls `evaluateWhereClause` recursively. This allows filtering on related entities:

```graphql
query Workspaces($filter: WorkspaceFilter) {
  workspaces(filter: $filter) {
    id
    name
    runs(filter: { status: { _eq: "applied" } }) {
      id
    }
  }
}

# variables
{
  "filter": {
    "organization": { "name": { "_eq": "acme" } },
    "tags": { "_ilike": "%production%" }
  }
}
```
:::danger
Read the following section as this can be very confusing for people new to GraphQL
:::
Nested filters are **ONLY** applied at that level.  There is no way to influence a parent entity with a nested filter.

Take the following query:
```graphql
query {
  teams {
    id
    users(filter: { name: { _like: "jeremy%"}}) {
      username
    }
  }
}
```
This will return **ALL** teams, not just teams that contain a user named Jeremy.  Then each teams' user set will be evaluated against the filter, so the user list will only contain users named Jeremy.  Teams that do not contain a user named Jeremy will still return a block with their ID, but an empty users list.

No filter objects contain a nested type to filter on.

### Server Side Filtering

Very few data sources use server side filtering. Even though some TFC/E APIs support server side filtering, it is very limited (for example, no logical operators).  Deconstructing the filter object to create some basic representation of a server side filter is very brittle.  It is only done in a few cases with the `runs` APIs due to the severe rate-limiting imposed on those.

Generally, a datasource loads a page of results and applies the filter in-memory. By doing it a page at a time, it can still prevent memory usage from spiking too much.

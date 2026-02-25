---
title: Team Tokens
description: Query API tokens scoped to a team
---

# Team Tokens

A **Team Token** is an API token scoped to a specific team. Team tokens inherit the team's permissions and can be used for automation workflows where individual user tokens are not appropriate.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `teamTokens(teamId: ID!, filter: TeamTokenFilter)` | List tokens for a team |
| `teamToken(id: ID!)` | Fetch a single token by ID |

## Example

```graphql
query TeamApiTokens($teamId: ID!) {
  teamTokens(teamId: $teamId) {
    id
    description
    createdAt
    lastUsedAt
    expiredAt
    createdById
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Token identifier |
| `teamId` | `ID!` | Parent team ID |
| `createdAt` | `DateTime!` | When the token was created |
| `lastUsedAt` | `DateTime` | Last time the token was used |
| `description` | `String` | Human-readable description |
| `token` | `String` | Token value (only returned on creation) |
| `expiredAt` | `DateTime` | When the token expires (null if no expiry) |
| `createdById` | `ID!` | ID of the user who created this token |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `teamId` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `lastUsedAt` | `DateTimeComparisonExp` |
| `description` | `StringComparisonExp` |
| `token` | `StringComparisonExp` |
| `expiredAt` | `DateTimeComparisonExp` |
| `createdById` | `StringComparisonExp` |

## Related Entities

- [Teams](../Concepts/concepts.md#entity-graph) — The team this token belongs to

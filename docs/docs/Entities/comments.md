---
title: Comments
description: Query user comments attached to runs
---

# Comments

A **Comment** is a text message attached to a Terraform run. Comments are used by team members to discuss plan results, flag issues, or record decisions during the run lifecycle.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `comments(runId: ID!, filter: CommentFilter)` | List all comments on a run |
| `comment(id: ID!)` | Fetch a single comment by ID |

## Example

```graphql
query RunComments($runId: ID!) {
  comments(runId: $runId) {
    id
    body
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Comment identifier |
| `body` | `String!` | Comment text content |
| `runEventId` | `ID` | Associated run event, if any |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `body` | `StringComparisonExp` |

## Related Entities

- [Runs](../Concepts/concepts.md#entity-graph) — The run this comment belongs to

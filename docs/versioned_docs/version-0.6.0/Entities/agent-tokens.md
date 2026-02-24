---
title: Agent Tokens
description: Query authentication tokens used by agents
---

# Agent Tokens

An **Agent Token** is a credential used by `tfc-agent` processes to authenticate with Terraform Cloud/Enterprise. Tokens are scoped to an [Agent Pool](agent-pools).

## Available Queries

| Query | Description |
| ----- | ----------- |
| `agentTokens(poolId: ID!, filter: AgentTokenFilter)` | List all tokens for a pool |
| `agentToken(id: ID!)` | Fetch a single token by ID |

## Example

```graphql
query TokensForPool($poolId: ID!) {
  agentTokens(poolId: $poolId) {
    id
    description
    createdAt
    lastUsedAt
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Token identifier |
| `poolId` | `String` | Parent agent pool ID |
| `createdAt` | `DateTime!` | When the token was created |
| `lastUsedAt` | `DateTime` | Last time the token was used (null if never used) |
| `description` | `String!` | Human-readable description |
| `createdById` | `ID!` | ID of the user who created this token |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `poolId` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `lastUsedAt` | `DateTimeComparisonExp` |
| `description` | `StringComparisonExp` |
| `createdById` | `StringComparisonExp` |

## Related Entities

- [Agent Pools](agent-pools) — The pool this token belongs to
- [Agents](agents) — Agents that use these tokens to connect

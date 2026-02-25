---
title: Agents
description: Query individual agent processes within an agent pool
---

# Agents

An **Agent** represents a single `tfc-agent` process registered to an [Agent Pool](agent-pools). Each agent reports its connection status, IP address, and heartbeat timestamp.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `agents(poolId: ID!, filter: AgentFilter)` | List all agents in a pool |
| `agent(id: ID!)` | Fetch a single agent by ID |

## Example

```graphql
query AgentsInPool($poolId: ID!) {
  agents(poolId: $poolId) {
    id
    name
    status
    ipAddress
    lastPingAt
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Agent identifier |
| `name` | `String` | Human-readable agent name |
| `status` | `String!` | Current status (e.g. `idle`, `busy`, `errored`) |
| `ipAddress` | `String!` | IP address the agent connected from |
| `lastPingAt` | `DateTime!` | Timestamp of the most recent heartbeat |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `ipAddress` | `StringComparisonExp` |
| `lastPingAt` | `DateTimeComparisonExp` |

## Related Entities

- [Agent Pools](agent-pools) — Parent pool that owns this agent
- [Agent Tokens](agent-tokens) — Tokens used by agents to authenticate

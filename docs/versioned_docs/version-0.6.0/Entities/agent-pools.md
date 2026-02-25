---
title: Agent Pools
description: Query named groups of agents scoped to an organization
---

# Agent Pools

An **Agent Pool** is a named collection of `tfc-agent` processes. Pools are scoped to an organization and can be assigned to specific workspaces for execution.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `agentPools(includeOrgs, excludeOrgs, filter: AgentPoolFilter)` | List pools across organizations |
| `agentPool(id: ID!)` | Fetch a single pool by ID |

## Example

```graphql
query AllAgentPools {
  agentPools(includeOrgs: ["my-org"]) {
    id
    name
    agentCount
    organizationScoped
    agents {
      id
      name
      status
    }
    workspaces {
      id
      name
    }
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Pool identifier |
| `type` | `String!` | Resource type |
| `name` | `String!` | Pool name |
| `createdAt` | `DateTime!` | When the pool was created |
| `organizationScoped` | `Boolean!` | Whether the pool is available to all workspaces in the org |
| `agentCount` | `Int!` | Number of agents currently in the pool |
| `workspaces` | `[Workspace!]!` | Workspaces assigned to this pool |
| `allowedWorkspaces` | `[Workspace!]!` | Workspaces explicitly allowed to use this pool |
| `agents` | `[Agent!]!` | Agents registered to this pool |
| `authenticationTokens` | `[AgentToken!]!` | Tokens for this pool |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `type` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `organizationScoped` | `BooleanComparisonExp` |
| `agentCount` | `IntComparisonExp` |

## Related Entities

- [Agents](agents) — Individual agent processes in the pool
- [Agent Tokens](agent-tokens) — Authentication tokens for this pool
- [Workspaces](../Concepts/concepts.md#entity-graph) — Workspaces assigned to this pool

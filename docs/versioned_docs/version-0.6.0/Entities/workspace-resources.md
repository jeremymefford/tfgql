---
title: Workspace Resources
description: Query individual Terraform-managed resources in a workspace
---

# Workspace Resources

A **Workspace Resource** represents a single resource managed by Terraform within a workspace (e.g. `aws_instance.web`, `google_compute_network.main`). These are extracted from the workspace's current state.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `workspaceResources(workspaceId: ID!, filter)` | List resources for a workspace |

Resources are also available as a nested field on `Workspace`:

```graphql
workspace(id: "ws-123") {
  workspaceResources {
    address
    provider
  }
}
```

## Example

```graphql
query ResourceInventory($wsId: ID!) {
  workspaceResources(workspaceId: $wsId) {
    id
    address
    name
    provider
    providerType
    module
    createdAt
    updatedAt
  }
}
```

Filter by provider to find all AWS resources:

```graphql
query AwsResources($wsId: ID!) {
  workspaceResources(
    workspaceId: $wsId
    filter: { provider: { _ilike: "%aws%" } }
  ) {
    address
    providerType
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Resource identifier |
| `address` | `String!` | Full resource address (e.g. `module.vpc.aws_subnet.private[0]`) |
| `name` | `String!` | Resource name without module prefix |
| `createdAt` | `DateTime!` | When the resource was first tracked |
| `updatedAt` | `DateTime!` | When the resource was last modified |
| `module` | `String!` | Module path (empty string for root module) |
| `provider` | `String!` | Provider name (e.g. `registry.terraform.io/hashicorp/aws`) |
| `providerType` | `String!` | Resource type (e.g. `aws_instance`) |
| `modifiedByStateVersion` | `StateVersion!` | State version that last modified this resource |
| `nameIndex` | `String` | Index key for indexed resources |
| `workspace` | `Workspace!` | Parent workspace |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `address` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `updatedAt` | `DateTimeComparisonExp` |
| `module` | `StringComparisonExp` |
| `provider` | `StringComparisonExp` |
| `providerType` | `StringComparisonExp` |
| `nameIndex` | `IntComparisonExp` |

## Related Entities

- [Workspaces](../Concepts/concepts.md#entity-graph) — The workspace managing this resource
- [State Versions](../Concepts/concepts.md#entity-graph) — State versions that track this resource

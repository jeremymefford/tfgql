---
title: Organization Tags
description: Query tags applied to workspaces within an organization
---

# Organization Tags

An **Organization Tag** is a label that can be applied to workspaces within an organization. Tags help categorize and filter workspaces for governance, reporting, and operational workflows.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `organizationTags(includeOrgs, excludeOrgs, filter: OrganizationTagFilter)` | List tags across organizations |

## Example

```graphql
query AllTags {
  organizationTags(includeOrgs: ["my-org"]) {
    id
    name
    instanceCount
    createdAt
  }
}
```

You can also filter workspaces by tag name using the workspace `tagNames` field:

```graphql
query WorkspacesByTag {
  workspaces(
    includeOrgs: ["my-org"]
    filter: { tagNames: { _eq: "production" } }
  ) {
    name
    tagNames
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Tag identifier |
| `name` | `String!` | Tag name |
| `createdAt` | `DateTime!` | When the tag was created |
| `instanceCount` | `Int!` | Number of workspaces this tag is applied to |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `instanceCount` | `IntComparisonExp` |
| `organizationId` | `StringComparisonExp` |

## Related Entities

- [Organizations](../Concepts/concepts.md#entity-graph) — The organization this tag belongs to
- [Workspaces](../Concepts/concepts.md#entity-graph) — Workspaces tagged with this label

---
title: State Version Outputs
description: Query Terraform state output values
---

# State Version Outputs

A **State Version Output** represents a single `output` value from a Terraform state. You can query outputs for a specific state version or search across all workspaces to find outputs by name — useful for discovering cross-workspace dependencies.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `stateVersionOutputs(stateVersionId: ID!, filter)` | List outputs for a specific state version |
| `stateVersionOutput(id: ID!)` | Fetch a single output by ID |
| `searchStateVersionOutputs(includeOrgs, excludeOrgs, filter!)` | Search outputs across all workspaces |

## Example

Get outputs from a state version:

```graphql
query StateOutputs($stateVersionId: ID!) {
  stateVersionOutputs(stateVersionId: $stateVersionId) {
    name
    type
    value
    sensitive
  }
}
```

Search for a named output across all workspaces:

```graphql
query FindOutput {
  searchStateVersionOutputs(
    includeOrgs: ["my-org"]
    filter: { name: { _eq: "vpc_id" } }
  ) {
    name
    value
    type
    stateVersion {
      id
    }
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Output identifier |
| `name` | `String!` | Output name as defined in Terraform config |
| `sensitive` | `Boolean!` | Whether the output is marked sensitive |
| `type` | `String!` | Terraform type (e.g. `string`, `list`, `map`) |
| `value` | `JSON!` | The output value |
| `detailedType` | `JSON!` | Detailed Terraform type information |
| `stateVersion` | `StateVersion` | The parent state version |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `name` | `StringComparisonExp` |
| `sensitive` | `BooleanComparisonExp` |
| `type` | `StringComparisonExp` |

## Related Entities

- [State Versions](../Concepts/concepts.md#entity-graph) — The state version containing this output
- [Workspaces](../Concepts/concepts.md#entity-graph) — The workspace that produced this state

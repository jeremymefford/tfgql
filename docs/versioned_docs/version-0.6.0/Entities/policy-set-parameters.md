---
title: Policy Set Parameters
description: Query key-value configuration for policy sets
---

# Policy Set Parameters

A **Policy Set Parameter** is a key-value pair that configures a [Policy Set](../Concepts/concepts.md#entity-graph). Parameters allow policy authors to write reusable policies that accept runtime configuration.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `policySetParameters(policySetId: ID!, filter: PolicySetParameterFilter)` | List parameters for a policy set |

## Example

```graphql
query PolicySetConfig($policySetId: ID!) {
  policySetParameters(policySetId: $policySetId) {
    id
    key
    value
    sensitive
    category
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Parameter identifier |
| `key` | `String!` | Parameter name |
| `value` | `String` | Parameter value (null if sensitive) |
| `sensitive` | `Boolean!` | Whether the value is write-only |
| `category` | `String!` | Parameter category |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `key` | `StringComparisonExp` |
| `value` | `StringComparisonExp` |
| `sensitive` | `BooleanComparisonExp` |
| `category` | `StringComparisonExp` |
| `policySetId` | `StringComparisonExp` |

## Related Entities

- [Policy Sets](../Concepts/concepts.md#entity-graph) — The policy set these parameters configure

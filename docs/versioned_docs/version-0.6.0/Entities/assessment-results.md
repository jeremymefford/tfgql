---
title: Assessment Results
description: Query drift detection and health check results
---

# Assessment Results

An **Assessment Result** records the outcome of a workspace health assessment (drift detection). Terraform Cloud periodically checks whether the actual infrastructure matches the expected state and records the result here.

## Available Queries

| Query | Description |
| ----- | ----------- |
| `assessmentResults(workspaceId: ID!, filter: AssessmentResultFilter)` | List results for a workspace |
| `assessmentResult(id: ID!)` | Fetch a single result by ID |

## Example

Find workspaces with detected drift:

```graphql
query DriftedWorkspaces {
  workspaces(includeOrgs: ["my-org"], filter: { assessmentsEnabled: { _eq: true } }) {
    name
    lastAssessmentResultAt
  }
}
```

Get detailed assessment history for a workspace:

```graphql
query AssessmentHistory($wsId: ID!) {
  assessmentResults(workspaceId: $wsId, filter: { drifted: { _eq: true } }) {
    id
    drifted
    succeeded
    errorMessage
    createdAt
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Assessment result identifier |
| `drifted` | `Boolean!` | Whether drift was detected |
| `succeeded` | `Boolean!` | Whether the assessment completed without errors |
| `errorMessage` | `String` | Error message if the assessment failed |
| `createdAt` | `DateTime!` | When the assessment was performed |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `drifted` | `BooleanComparisonExp` |
| `succeeded` | `BooleanComparisonExp` |
| `errorMessage` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |

## Related Entities

- [Workspaces](../Concepts/concepts.md#entity-graph) — Parent workspace for the assessment

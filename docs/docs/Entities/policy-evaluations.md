---
title: Policy Evaluations
description: Query Sentinel and OPA policy evaluation results
---

# Policy Evaluations

A **Policy Evaluation** records the outcome of Sentinel or OPA policy checks executed during an agent-mode run. Each evaluation contains result counts and links to individual policy set outcomes.

:::info
Policy evaluations are the **agent-mode** policy path. For legacy Sentinel checks, see `policyChecks` on the `Run` type. Both can exist on the same run — treat them as separate metric families.
:::

## Available Queries

| Query | Description |
| ----- | ----------- |
| `policyEvaluations(taskStageId: ID!, filter: PolicyEvaluationFilter)` | List evaluations for a task stage |

## Example

```graphql
query PolicyResults($taskStageId: ID!) {
  policyEvaluations(taskStageId: $taskStageId) {
    id
    status
    policyKind
    resultCount {
      passed
      advisoryFailed
      mandatoryFailed
      errored
    }
    statusTimestamps {
      queuedAt
      runningAt
      passedAt
      erroredAt
    }
    policySetOutcomes {
      policySetName
      overridable
      resultCount {
        passed
        mandatoryFailed
        advisoryFailed
        errored
      }
    }
  }
}
```

## Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Evaluation identifier |
| `status` | `String!` | Overall status (`passed`, `failed`, `errored`) |
| `policyKind` | `String!` | Policy framework (`sentinel` or `opa`) |
| `resultCount` | `PolicyEvaluationResultCount!` | Aggregate pass/fail counts |
| `statusTimestamps` | `PolicyEvaluationStatusTimestamps!` | Timestamps for status transitions |
| `createdAt` | `DateTime!` | When the evaluation started |
| `updatedAt` | `DateTime!` | When the evaluation last changed |
| `policyAttachableId` | `ID` | ID of the attachable resource |
| `policySetOutcomes` | `[PolicySetOutcome!]!` | Per-policy-set breakdown |

### PolicySetOutcome

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `ID!` | Outcome identifier |
| `policySetName` | `String!` | Name of the policy set |
| `policySetDescription` | `String` | Description of the policy set |
| `overridable` | `Boolean!` | Whether failures can be overridden |
| `error` | `String` | Error message, if any |
| `resultCount` | `PolicySetOutcomeResultCount!` | Pass/fail breakdown for this set |

## Filter Fields

| Field | Comparison Type |
| ----- | --------------- |
| `id` | `StringComparisonExp` |
| `status` | `StringComparisonExp` |
| `policyKind` | `StringComparisonExp` |
| `createdAt` | `DateTimeComparisonExp` |
| `updatedAt` | `DateTimeComparisonExp` |
| `policyAttachableId` | `StringComparisonExp` |

## Related Entities

- [Runs](../Concepts/concepts.md#entity-graph) — The run that triggered this evaluation
- [Policy Sets](../Concepts/concepts.md#entity-graph) — Policy sets that were evaluated

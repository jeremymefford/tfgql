import { gql } from "graphql-tag";

const policyEvaluationsSchema = gql`
  """
  Counts of policy evaluation results, grouped by outcome.
  """
  type PolicyEvaluationResultCount {
    """Count of policies that failed at the advisory level."""
    advisoryFailed: Int!
    """Count of policies that encountered errors during evaluation."""
    errored: Int!
    """Count of policies that failed at the mandatory level."""
    mandatoryFailed: Int!
    """Count of policies that passed evaluation."""
    passed: Int!
  }

  """
  Timestamps for each policy evaluation status transition.
  """
  type PolicyEvaluationStatusTimestamps {
    """Timestamp when the evaluation was queued."""
    queuedAt: DateTime
    """Timestamp when evaluation execution began."""
    runningAt: DateTime
    """Timestamp when the evaluation completed successfully."""
    passedAt: DateTime
    """Timestamp when the evaluation encountered an error."""
    erroredAt: DateTime
  }

  """
  Counts of policy outcomes within a single policy set evaluation.
  """
  type PolicySetOutcomeResultCount {
    """Count of policies that failed at the advisory level within this policy set."""
    advisoryFailed: Int!
    """Count of policies that failed at the mandatory level within this policy set."""
    mandatoryFailed: Int!
    """Count of policies that passed within this policy set."""
    passed: Int!
    """Count of policies that errored within this policy set."""
    errored: Int!
  }

  """
  The evaluation result of a single policy set, including individual policy outcomes and override status.
  """
  type PolicySetOutcome {
    """The policy set outcome's unique identifier."""
    id: ID!
    """Detailed individual policy outcomes as a JSON object."""
    outcomes: JSON
    """Error message if the policy set evaluation failed."""
    error: String
    """Warning messages generated during policy set evaluation."""
    warnings: [JSON!]!
    """Whether the failed policies in this set can be overridden."""
    overridable: Boolean!
    """The name of the policy set that was evaluated."""
    policySetName: String!
    """The description of the policy set that was evaluated."""
    policySetDescription: String
    """Aggregated pass/fail/error counts for policies in this set."""
    resultCount: PolicySetOutcomeResultCount!
  }

  """
  An OPA or Sentinel policy evaluation performed during a run's task stage. Contains aggregated result counts and individual policy set outcomes.
  """
  type PolicyEvaluation {
    """The policy evaluation's unique identifier."""
    id: ID!
    """Current state of the evaluation (e.g., 'passed', 'failed', 'errored')."""
    status: String!
    """The policy engine type: 'sentinel' or 'opa'."""
    policyKind: String!
    """Aggregated pass/fail/error counts across all policies in this evaluation."""
    resultCount: PolicyEvaluationResultCount!
    """Timestamps for each evaluation status transition."""
    statusTimestamps: PolicyEvaluationStatusTimestamps!
    """Timestamp when the evaluation was created."""
    createdAt: DateTime!
    """Timestamp when the evaluation was last modified."""
    updatedAt: DateTime!
    """The ID of the task stage this evaluation is attached to."""
    policyAttachableId: ID
    """Individual policy set outcomes from this evaluation."""
    policySetOutcomes: [PolicySetOutcome!]!
  }

  """
  Filter conditions for PolicyEvaluation queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input PolicyEvaluationFilter {
    _and: [PolicyEvaluationFilter!]
    _or: [PolicyEvaluationFilter!]
    _not: PolicyEvaluationFilter

    id: StringComparisonExp
    status: StringComparisonExp
    policyKind: StringComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
    policyAttachableId: StringComparisonExp
  }

  extend type Query {
    """
    List all policy evaluations for a specific task stage.
    """
    policyEvaluations(
      taskStageId: ID!
      filter: PolicyEvaluationFilter
    ): [PolicyEvaluation!]!
  }
`;

export default policyEvaluationsSchema;

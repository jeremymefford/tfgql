import { gql } from "graphql-tag";

const policyEvaluationsSchema = gql`
  """
  Counts of policy evaluation results, grouped by outcome.
  """
  type PolicyEvaluationResultCount {
    advisoryFailed: Int!
    errored: Int!
    mandatoryFailed: Int!
    passed: Int!
  }

  """
  Timestamps for each policy evaluation status transition.
  """
  type PolicyEvaluationStatusTimestamps {
    queuedAt: DateTime
    runningAt: DateTime
    passedAt: DateTime
    erroredAt: DateTime
  }

  """
  Counts of policy outcomes within a single policy set evaluation.
  """
  type PolicySetOutcomeResultCount {
    advisoryFailed: Int!
    mandatoryFailed: Int!
    passed: Int!
    errored: Int!
  }

  """
  The evaluation result of a single policy set, including individual policy outcomes and override status.
  """
  type PolicySetOutcome {
    id: ID!
    outcomes: JSON
    error: String
    warnings: [JSON!]!
    overridable: Boolean!
    policySetName: String!
    policySetDescription: String
    resultCount: PolicySetOutcomeResultCount!
  }

  """
  An OPA or Sentinel policy evaluation performed during a run's task stage. Contains aggregated result counts and individual policy set outcomes.
  """
  type PolicyEvaluation {
    id: ID!
    status: String!
    policyKind: String!
    resultCount: PolicyEvaluationResultCount!
    statusTimestamps: PolicyEvaluationStatusTimestamps!
    createdAt: DateTime!
    updatedAt: DateTime!
    policyAttachableId: ID
    policySetOutcomes: [PolicySetOutcome!]!
  }

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

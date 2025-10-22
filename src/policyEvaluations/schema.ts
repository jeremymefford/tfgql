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

  type PolicySetOutcomeResultCount {
    advisoryFailed: Int!
    mandatoryFailed: Int!
    passed: Int!
    errored: Int!
  }

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
    policyEvaluations(
      taskStageId: ID!
      filter: PolicyEvaluationFilter
    ): [PolicyEvaluation!]!
  }
`;

export default policyEvaluationsSchema;

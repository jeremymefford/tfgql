import { gql } from 'graphql-tag';

const policyEvaluationsSchema = gql`
  type PolicyEvaluation {
    id: ID!
    status: String!
    policyKind: String!
    policyToolVersion: String!
    resultCount: PolicyEvaluationResultCount!
    statusTimestamps: PolicyEvaluationStatusTimestamps!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input PolicyEvaluationFilter {
    _and: [PolicyEvaluationFilter!]
    _or: [PolicyEvaluationFilter!]
    _not: PolicyEvaluationFilter

    id: StringComparisonExp
    status: StringComparisonExp
    policyKind: StringComparisonExp
    policyToolVersion: StringComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
    policyAttachableId: StringComparisonExp
  }

  extend type Query {
    policyEvaluations(taskStageId: ID!, filter: PolicyEvaluationFilter): [PolicyEvaluation!]!
    policyEvaluation(id: ID!): PolicyEvaluation
  }
`;

export default policyEvaluationsSchema;
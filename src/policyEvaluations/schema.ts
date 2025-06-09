import { gql } from 'graphql-tag';

const policyEvaluationsSchema = gql`
  type PolicyEvaluation {
    id: ID!
    # TODO: add PolicyEvaluation fields based on Terraform Cloud API
  }

  input PolicyEvaluationFilter {
    _and: [PolicyEvaluationFilter!]
    _or: [PolicyEvaluationFilter!]
    _not: PolicyEvaluationFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    policyEvaluations(policySetId: ID!, filter: PolicyEvaluationFilter): [PolicyEvaluation!]!
    policyEvaluation(id: ID!): PolicyEvaluation
  }
`;

export default policyEvaluationsSchema;
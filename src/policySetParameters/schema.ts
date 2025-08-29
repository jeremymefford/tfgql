import { gql } from 'graphql-tag';

const policySetParametersSchema = gql`
  type PolicySetParameter {
    id: ID!
    key: String!
    value: String
    sensitive: Boolean!
    category: String!
  }

  input PolicySetParameterFilter {
    _and: [PolicySetParameterFilter!]
    _or: [PolicySetParameterFilter!]
    _not: PolicySetParameterFilter

    id: StringComparisonExp
    key: StringComparisonExp
    value: StringComparisonExp
    sensitive: BooleanComparisonExp
    category: StringComparisonExp
    policySetId: StringComparisonExp
  }

  extend type Query {
    policySetParameters(policySetId: ID!, filter: PolicySetParameterFilter): [PolicySetParameter!]!
  }
`;

export default policySetParametersSchema;
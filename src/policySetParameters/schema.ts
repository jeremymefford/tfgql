import { gql } from "graphql-tag";

const policySetParametersSchema = gql`
  """
  A key/value pair sent to the Sentinel runtime during policy checks. Parameters help avoid hardcoding sensitive values into policies.
  """
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
    """
    List all parameters for a specific policy set.
    """
    policySetParameters(
      policySetId: ID!
      filter: PolicySetParameterFilter
    ): [PolicySetParameter!]!
  }
`;

export default policySetParametersSchema;

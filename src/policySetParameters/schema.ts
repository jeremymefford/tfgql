import { gql } from "graphql-tag";

const policySetParametersSchema = gql`
  """
  A key/value pair sent to the Sentinel runtime during policy checks. Parameters help avoid hardcoding sensitive values into policies.
  """
  type PolicySetParameter {
    """The parameter's unique identifier."""
    id: ID!
    """The parameter name."""
    key: String!
    """The parameter value. Returns null for sensitive parameters."""
    value: String
    """Whether the parameter value is sensitive and write-only."""
    sensitive: Boolean!
    """The parameter category: 'policy-set'."""
    category: String!
  }

  """
  Filter conditions for PolicySetParameter queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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

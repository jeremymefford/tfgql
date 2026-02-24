import { gql } from "graphql-tag";

const filterSchema = gql`
  """
  Comparison operators for filtering on String fields. Supports equality, pattern matching, inclusion, and null checks.
  """
  input StringComparisonExp {
    _eq: String
    _neq: String
    _in: [String!]
    _nin: [String!]
    _like: String
    _nlike: String
    _ilike: String
    _nilike: String
    _is_null: Boolean
  }

  """
  Comparison operators for filtering on Terraform version strings. Extends string comparisons with semver-aware ordering (_gt, _gte, _lt, _lte).
  """
  input TerraformVersionComparisonExp {
    _eq: String
    _neq: String
    _in: [String!]
    _nin: [String!]
    _like: String
    _nlike: String
    _ilike: String
    _nilike: String
    _is_null: Boolean
    _gt: String
    _gte: String
    _lt: String
    _lte: String
  }

  """
  Comparison operators for filtering on integer fields. Supports equality, range comparisons, inclusion, and null checks.
  """
  input IntComparisonExp {
    _eq: Int
    _neq: Int
    _in: [Int!]
    _nin: [Int!]
    _is_null: Boolean
    _gt: Int
    _gte: Int
    _lt: Int
    _lte: Int
  }

  """
  Comparison operators for filtering on boolean fields. Supports equality and null checks.
  """
  input BooleanComparisonExp {
    _eq: Boolean
    _neq: Boolean
    _is_null: Boolean
  }

  """
  Comparison operators for filtering on DateTime fields. Supports equality, range comparisons, inclusion, and null checks.
  """
  input DateTimeComparisonExp {
    _eq: DateTime
    _neq: DateTime
    _in: [DateTime!]
    _nin: [DateTime!]
    _is_null: Boolean
    _gt: DateTime
    _gte: DateTime
    _lt: DateTime
    _lte: DateTime
  }
`;

export default filterSchema;

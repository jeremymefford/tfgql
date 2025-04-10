import { gql } from 'graphql-tag';

const filterSchema = gql`
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
    _gt: String
    _gte: String
    _lt: String
    _lte: String
  }

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

  input BooleanComparisonExp {
    _eq: Boolean
    _neq: Boolean
    _is_null: Boolean
  }

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

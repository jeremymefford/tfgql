import { gql } from "graphql-tag";

const stateVersionOutputsSchema = gql`
  type StateVersionOutput {
    id: ID!
    name: String!
    sensitive: Boolean!
    type: String!
    value: JSON!
    detailedType: JSON!
  }

  input StateVersionOutputFilter {
    _and: [StateVersionOutputFilter!]
    _or: [StateVersionOutputFilter!]
    _not: StateVersionOutputFilter

    id: StringComparisonExp
    name: StringComparisonExp
    sensitive: BooleanComparisonExp
    type: StringComparisonExp
  }

  extend type Query {
    stateVersionOutputs(
      stateVersionId: ID!
      filter: StateVersionOutputFilter
    ): [StateVersionOutput!]!
    stateVersionOutput(id: ID!): StateVersionOutput
  }
`;

export default stateVersionOutputsSchema;

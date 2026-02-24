import { gql } from "graphql-tag";

const stateVersionOutputsSchema = gql`
  """
  An output value from a Terraform state version. Contains the output name, type, value, and sensitivity flag.
  """
  type StateVersionOutput {
    id: ID!
    name: String!
    sensitive: Boolean!
    type: String!
    value: JSON!
    detailedType: JSON!
    stateVersion: StateVersion
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
    """
    List outputs for a specific state version.
    """
    stateVersionOutputs(
      stateVersionId: ID!
      filter: StateVersionOutputFilter
    ): [StateVersionOutput!]!
    """
    Look up a single state version output by ID.
    """
    stateVersionOutput(id: ID!): StateVersionOutput
    """
    Search state version outputs across all workspaces in the selected organizations. Useful for finding cross-workspace output dependencies.
    """
    searchStateVersionOutputs(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: StateVersionOutputFilter!
    ): [StateVersionOutput!]!
  }
`;

export default stateVersionOutputsSchema;

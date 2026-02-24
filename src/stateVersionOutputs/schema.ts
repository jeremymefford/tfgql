import { gql } from "graphql-tag";

const stateVersionOutputsSchema = gql`
  """
  An output value from a Terraform state version. Contains the output name, type, value, and sensitivity flag.
  """
  type StateVersionOutput {
    """
    The state version output's unique identifier.
    """
    id: ID!
    """
    The output variable name as defined in the Terraform configuration.
    """
    name: String!
    """
    Whether the output value is marked as sensitive and should be hidden in UI displays.
    """
    sensitive: Boolean!
    """
    The data type of the output value (e.g., 'string', 'number', 'list').
    """
    type: String!
    """
    The output value. May be a string, number, boolean, array, or object depending on type.
    """
    value: JSON!
    """
    A more granular type specification providing structural details about complex output types.
    """
    detailedType: JSON!
    """
    The state version this output belongs to.
    """
    stateVersion: StateVersion
  }

  """
  Filter conditions for StateVersionOutput queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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

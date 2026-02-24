import { gql } from "graphql-tag";

const variableSetSchema = gql`
  """
  A reusable collection of variables that can be applied to multiple workspaces and projects across an organization. Global variable sets apply to all workspaces automatically.
  """
  type VariableSet {
    """The variable set's unique identifier."""
    id: ID!
    """The name of the variable set."""
    name: String!
    """A text description of the variable set's purpose."""
    description: String
    """When true, the variable set is automatically applied to all current and future workspaces in the organization."""
    global: Boolean!
    """Timestamp when the variable set was last modified."""
    updatedAt: DateTime!
    """Number of variables in this variable set."""
    varCount: Int!
    """Number of workspaces this variable set is applied to."""
    workspaceCount: Int!
    """Number of projects this variable set is applied to."""
    projectCount: Int!
    """When true, variables in this set override any other variable values with a more specific scope, including command-line values."""
    priority: Boolean!
    """Permissions the current user has on this variable set."""
    permissions: VariableSetPermissions!

    """The organization this variable set belongs to."""
    organization: Organization
    """Variables contained in this variable set."""
    vars(filter: VariableFilter): [Variable!]
    """Workspaces this variable set is applied to."""
    workspaces(filter: WorkspaceFilter): [Workspace!]
    """Projects this variable set is applied to."""
    projects(filter: ProjectFilter): [Project!]
  }

  """
  Permissions the current API token has on a variable set.
  """
  type VariableSetPermissions {
    """Whether the current user can modify this variable set."""
    canUpdate: Boolean!
  }

  extend type Query {
    """
    List all variable sets across the selected organizations.
    """
    variableSets(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: VariableSetFilter
    ): [VariableSet!]!
    """
    Look up a single variable set by ID.
    """
    variableSet(id: ID!): VariableSet
  }

  """
  Filter conditions for VariableSet queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input VariableSetFilter {
    _and: [VariableSetFilter!]
    _or: [VariableSetFilter!]
    _not: VariableSetFilter

    id: StringComparisonExp
    name: StringComparisonExp
    description: StringComparisonExp
    global: BooleanComparisonExp
    updatedAt: DateTimeComparisonExp
    varCount: IntComparisonExp
    workspaceCount: IntComparisonExp
    projectCount: IntComparisonExp
    priority: BooleanComparisonExp
    permissions: VariableSetPermissionsFilter
  }

  """
  Filter conditions for VariableSet.permissions fields.
  """
  input VariableSetPermissionsFilter {
    canUpdate: BooleanComparisonExp
  }
`;
export default variableSetSchema;

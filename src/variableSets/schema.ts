import { gql } from "graphql-tag";

const variableSetSchema = gql`
  """
  A reusable collection of variables that can be applied to multiple workspaces and projects across an organization. Global variable sets apply to all workspaces automatically.
  """
  type VariableSet {
    id: ID!
    name: String!
    description: String
    global: Boolean!
    updatedAt: DateTime!
    varCount: Int!
    workspaceCount: Int!
    projectCount: Int!
    priority: Boolean!
    permissions: VariableSetPermissions!

    organization: Organization
    vars(filter: VariableFilter): [Variable!]
    workspaces(filter: WorkspaceFilter): [Workspace!]
    projects(filter: ProjectFilter): [Project!]
  }

  type VariableSetPermissions {
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

  input VariableSetPermissionsFilter {
    canUpdate: BooleanComparisonExp
  }
`;
export default variableSetSchema;

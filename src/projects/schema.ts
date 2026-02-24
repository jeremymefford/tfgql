import gql from "graphql-tag";

const projectsSchema = gql`
  type ProjectPermissions {
    canRead: Boolean
    canUpdate: Boolean
    canDestroy: Boolean
    canCreateWorkspace: Boolean
    canMoveWorkspace: Boolean
    canMoveStack: Boolean
    canDeployNoCodeModules: Boolean
    canReadTeams: Boolean
    canManageTags: Boolean
    canManageTeams: Boolean
    canManageInHcp: Boolean
    canManageEphemeralWorkspaceForProjects: Boolean
    canManageVarsets: Boolean
  }

  type SettingOverwrites {
    defaultExecutionMode: Boolean
    defaultAgentPool: Boolean
  }

  """
  A container for organizing workspaces within an organization. Projects group related workspaces and control team access at a higher level.
  """
  type Project {
    id: ID!
    name: String!
    description: String
    createdAt: DateTime
    workspaceCount: Int
    teamCount: Int
    stackCount: Int
    autoDestroyActivityDuration: String
    defaultExecutionMode: String
    settingOverwrites: SettingOverwrites
    permissions: ProjectPermissions
    organization: Organization
    workspaces(filter: WorkspaceFilter): [Workspace!]!
    teams(filter: TeamFilter): [Team!]!
    variableSets(filter: VariableSetFilter): [VariableSet!]!
    teamAccess(filter: ProjectTeamAccessFilter): [ProjectTeamAccess!]!
  }

  extend type Query {
    """
    List all projects across the selected organizations.
    """
    projects(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: ProjectFilter
    ): [Project!]!
    """
    Look up a single project by ID.
    """
    project(id: ID!): Project
  }

  input ProjectPermissionsFilter {
    _and: [ProjectPermissionsFilter!]
    _or: [ProjectPermissionsFilter!]
    _not: ProjectPermissionsFilter

    canRead: BooleanComparisonExp
    canUpdate: BooleanComparisonExp
    canDestroy: BooleanComparisonExp
    canCreateWorkspace: BooleanComparisonExp
    canMoveWorkspace: BooleanComparisonExp
    canMoveStack: BooleanComparisonExp
    canDeployNoCodeModules: BooleanComparisonExp
    canReadTeams: BooleanComparisonExp
    canManageTags: BooleanComparisonExp
    canManageTeams: BooleanComparisonExp
    canManageInHcp: BooleanComparisonExp
    canManageEphemeralWorkspaceForProjects: BooleanComparisonExp
    canManageVarsets: BooleanComparisonExp
  }

  input ProjectFilter {
    _and: [ProjectFilter!]
    _or: [ProjectFilter!]
    _not: ProjectFilter

    id: StringComparisonExp
    name: StringComparisonExp
    description: StringComparisonExp
    createdAt: DateTimeComparisonExp
    workspaceCount: IntComparisonExp
    defaultExecutionMode: StringComparisonExp
    teamCount: IntComparisonExp
    stackCount: IntComparisonExp
    autoDestroyActivityDuration: StringComparisonExp
    permissions: ProjectPermissionsFilter
  }
`;

export default projectsSchema;

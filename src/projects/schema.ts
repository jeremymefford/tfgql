import gql from "graphql-tag";

const projectsSchema = gql`
  """
  Permissions the current API token has on a project, controlling which operations are allowed.
  """
  type ProjectPermissions {
    """Whether the current user can view this project."""
    canRead: Boolean
    """Whether the current user can modify this project."""
    canUpdate: Boolean
    """Whether the current user can delete this project."""
    canDestroy: Boolean
    """Whether the current user can create workspaces within this project."""
    canCreateWorkspace: Boolean
    """Whether the current user can move workspaces into or out of this project."""
    canMoveWorkspace: Boolean
    """Whether the current user can move Stacks between projects."""
    canMoveStack: Boolean
    """Whether the current user can deploy no-code modules in this project."""
    canDeployNoCodeModules: Boolean
    """Whether the current user can view teams with access to this project."""
    canReadTeams: Boolean
    """Whether the current user can manage tags on this project."""
    canManageTags: Boolean
    """Whether the current user can manage team access on this project."""
    canManageTeams: Boolean
    """Whether the current user can manage this project in HCP."""
    canManageInHcp: Boolean
    """Whether the current user can manage ephemeral workspaces for this project."""
    canManageEphemeralWorkspaceForProjects: Boolean
    """Whether the current user can manage variable sets on this project."""
    canManageVarsets: Boolean
  }

  """
  Indicates which project settings are overridden locally rather than inherited from the organization.
  """
  type SettingOverwrites {
    """Whether the project overrides the organization's default execution mode."""
    defaultExecutionMode: Boolean
    """Whether the project overrides the organization's default agent pool."""
    defaultAgentPool: Boolean
  }

  """
  A container for organizing workspaces within an organization. Projects group related workspaces and control team access at a higher level.
  """
  type Project {
    """The project's unique identifier."""
    id: ID!
    """The project name. Can contain letters, numbers, spaces, hyphens, and underscores."""
    name: String!
    """A text description of the project's purpose (max 256 characters)."""
    description: String
    """Timestamp when the project was created."""
    createdAt: DateTime
    """Number of workspaces within this project."""
    workspaceCount: Int
    """Number of teams with access to this project."""
    teamCount: Int
    """Number of stacks within this project."""
    stackCount: Int
    """Inactivity duration (e.g., '14d', '2h') before workspaces are scheduled for auto-destroy."""
    autoDestroyActivityDuration: String
    """Default execution mode for workspaces in this project: 'remote', 'local', or 'agent'."""
    defaultExecutionMode: String
    """Indicates which settings are overridden at the project level rather than inherited from the organization."""
    settingOverwrites: SettingOverwrites
    """Permissions the current user has on this project."""
    permissions: ProjectPermissions
    """The parent organization containing this project."""
    organization: Organization
    """Workspaces belonging to this project, with optional filtering."""
    workspaces(filter: WorkspaceFilter): [Workspace!]!
    """Teams with access to this project, with optional filtering."""
    teams(filter: TeamFilter): [Team!]!
    """Variable sets applied to this project, with optional filtering."""
    variableSets(filter: VariableSetFilter): [VariableSet!]!
    """Team access grants for this project."""
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

  """
  Filter conditions for Project.permissions fields.
  """
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

  """
  Filter conditions for Project queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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

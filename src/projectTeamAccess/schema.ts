import { gql } from "graphql-tag";

const projectTeamAccessSchema = gql`
  """
  Associates a team with a project and defines the team's permission level for project settings, teams, and workspace operations within the project.
  """
  type ProjectTeamAccess {
    """The project team access grant's unique identifier."""
    id: ID!
    """The permission level: 'read', 'write', 'maintain', 'admin', or 'custom'."""
    access: String!
    """Project-level permission settings for this team."""
    projectAccess: ProjectAccess!
    """Workspace-level permission settings granted through this project access."""
    workspaceAccess: WorkspaceAccess!
    """The project this access grant applies to."""
    project: Project!
    """The team this access grant is for."""
    team: Team!
  }

  """
  Filter conditions for ProjectTeamAccess queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input ProjectTeamAccessFilter {
    _and: [ProjectTeamAccessFilter!]
    _or: [ProjectTeamAccessFilter!]
    _not: ProjectTeamAccessFilter

    id: StringComparisonExp
    access: StringComparisonExp
    projectId: StringComparisonExp
    teamId: StringComparisonExp
  }

  """
  Project-level permission settings for a team.
  """
  type ProjectAccess {
    """Permission level for project settings: 'read', 'update', or 'delete'."""
    settings: String!
    """Permission level for managing project teams: 'none', 'read', or 'manage'."""
    teams: String!
  }

  """
  Workspace-level permission settings granted through project team access.
  """
  type WorkspaceAccess {
    """Whether the team can create workspaces within the project."""
    create: Boolean!
    """Whether the team can move workspaces between projects."""
    move: Boolean!
    """Whether the team can manually lock and unlock workspaces."""
    locking: Boolean!
    """Whether the team can delete workspaces."""
    delete: Boolean!
    """Permission level for workspace runs: 'read', 'plan', or 'apply'."""
    runs: String!
    """Permission level for workspace variables: 'none', 'read', or 'write'."""
    variables: String!
    """Permission level for state versions: 'none', 'read-outputs', 'read', or 'write'."""
    stateVersions: String!
    """Permission level for Sentinel policy mocks: 'none' or 'read'."""
    sentinelMocks: String!
    """Whether the team can manage run tasks within workspaces."""
    runTasks: Boolean!
  }

  extend type Query {
    """
    List all team access grants for a specific project.
    """
    projectTeamAccessByProject(
      projectId: ID!
      filter: ProjectTeamAccessFilter
    ): [ProjectTeamAccess!]!
    """
    List all project access grants for a specific team.
    """
    projectTeamAccessByTeam(
      teamId: ID!
      filter: ProjectTeamAccessFilter
    ): [ProjectTeamAccess!]!
    """
    Look up a single project team access grant by ID.
    """
    projectTeamAccessById(id: ID!): ProjectTeamAccess
  }
`;

export default projectTeamAccessSchema;

import { gql } from "graphql-tag";

const projectTeamAccessSchema = gql`
  """
  Associates a team with a project and defines the team's permission level for project settings, teams, and workspace operations within the project.
  """
  type ProjectTeamAccess {
    id: ID!
    access: String!
    projectAccess: ProjectAccess!
    workspaceAccess: WorkspaceAccess!
    project: Project!
    team: Team!
  }

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
    settings: String!
    teams: String!
  }

  """
  Workspace-level permission settings granted through project team access.
  """
  type WorkspaceAccess {
    create: Boolean!
    move: Boolean!
    locking: Boolean!
    delete: Boolean!
    runs: String!
    variables: String!
    stateVersions: String!
    sentinelMocks: String!
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

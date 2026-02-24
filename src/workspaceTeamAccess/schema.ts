import { gql } from "graphql-tag";

const workspaceTeamAccessSchema = gql`
  """
  Associates a team with a workspace and defines the team's permission level for runs, variables, state, and other workspace operations.
  """
  type WorkspaceTeamAccess {
    id: ID!
    access: String!
    runs: String!
    variables: String!
    stateVersions: String!
    sentinelMocks: String!
    workspaceLocking: Boolean!
    runTasks: Boolean!
    team: Team!
    workspace: Workspace!
  }

  input WorkspaceTeamAccessFilter {
    _and: [WorkspaceTeamAccessFilter!]
    _or: [WorkspaceTeamAccessFilter!]
    _not: WorkspaceTeamAccessFilter

    id: StringComparisonExp
    access: StringComparisonExp
    runs: StringComparisonExp
    variables: StringComparisonExp
    stateVersions: StringComparisonExp
    sentinelMocks: StringComparisonExp
    workspaceLocking: BooleanComparisonExp
    runTasks: BooleanComparisonExp
    workspaceId: StringComparisonExp
    teamId: StringComparisonExp
  }

  extend type Query {
    """
    List all team access grants for a specific workspace.
    """
    workspaceTeamAccessByWorkspace(
      workspaceId: ID!
      filter: WorkspaceTeamAccessFilter
    ): [WorkspaceTeamAccess!]!
    """
    List all workspace access grants for a specific team.
    """
    workspaceTeamAccessByTeam(
      teamId: ID!
      filter: WorkspaceTeamAccessFilter
    ): [WorkspaceTeamAccess!]!
    """
    Look up a single workspace team access grant by ID.
    """
    workspaceTeamAccessById(id: ID!): WorkspaceTeamAccess
  }
`;

export default workspaceTeamAccessSchema;

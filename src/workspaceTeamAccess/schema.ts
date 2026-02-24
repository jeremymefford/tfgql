import { gql } from "graphql-tag";

const workspaceTeamAccessSchema = gql`
  """
  Associates a team with a workspace and defines the team's permission level for runs, variables, state, and other workspace operations.
  """
  type WorkspaceTeamAccess {
    """The workspace team access grant's unique identifier."""
    id: ID!
    """The permission level: 'read', 'plan', 'write', 'admin', or 'custom'."""
    access: String!
    """Permission level for workspace runs: 'read', 'plan', or 'apply'. Only applies when access is 'custom'."""
    runs: String!
    """Permission level for workspace variables: 'none', 'read', or 'write'. Only applies when access is 'custom'."""
    variables: String!
    """Permission level for state versions: 'none', 'read-outputs', 'read', or 'write'. Only applies when access is 'custom'."""
    stateVersions: String!
    """Permission level for Sentinel policy mocks: 'none' or 'read'. Only applies when access is 'custom'."""
    sentinelMocks: String!
    """Whether the team can manually lock and unlock the workspace."""
    workspaceLocking: Boolean!
    """Whether the team can manage run tasks within the workspace."""
    runTasks: Boolean!
    """The team this access grant is for."""
    team: Team!
    """The workspace this access grant applies to."""
    workspace: Workspace!
  }

  """
  Filter conditions for WorkspaceTeamAccess queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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

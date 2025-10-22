import { gql } from "graphql-tag";

const workspaceTeamAccessSchema = gql`
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
    workspaceTeamAccessByWorkspace(
      workspaceId: ID!
      filter: WorkspaceTeamAccessFilter
    ): [WorkspaceTeamAccess!]!
    workspaceTeamAccessByTeam(
      teamId: ID!
      filter: WorkspaceTeamAccessFilter
    ): [WorkspaceTeamAccess!]!
    workspaceTeamAccessById(id: ID!): WorkspaceTeamAccess
  }
`;

export default workspaceTeamAccessSchema;

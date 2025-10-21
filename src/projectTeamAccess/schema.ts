import { gql } from "graphql-tag";

const projectTeamAccessSchema = gql`
  type ProjectTeamAccess {
    id: ID!
    access: String!
    projectAccess: ProjectAccess!
    workspaceAccess: WorkspaceAccess!
    projectId: ID!
    teamId: ID!
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

  type ProjectAccess {
    settings: String!
    teams: String!
  }

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
    projectTeamAccessByProject(
      projectId: ID!
      filter: ProjectTeamAccessFilter
    ): [ProjectTeamAccess!]!
    projectTeamAccessById(id: ID!): ProjectTeamAccess
  }
`;

export default projectTeamAccessSchema;

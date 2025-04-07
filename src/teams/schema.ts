import { gql } from 'graphql-tag';

const teamSchema = gql`
  type Team {
    id: ID!
    name: String!
    ssoTeamId: String
    usersCount: Int!
    visibility: String!
    allowMemberTokenManagement: Boolean!
    permissions: TeamPermissions!
    organizationAccess: TeamOrganizationAccess!
    organization: Organization!
    users: [User!]!
  }

  type TeamPermissions {
    canUpdateMembership: Boolean
    canDestroy: Boolean
    canUpdateOrganizationAccess: Boolean
    canUpdateApiToken: Boolean
    canUpdateVisibility: Boolean
    canUpdateName: Boolean
    canUpdateSsoTeamId: Boolean
    canUpdateMemberTokenManagement: Boolean
    canViewApiToken: Boolean
  }

  type TeamOrganizationAccess {
    managePolicies: Boolean
    manageWorkspaces: Boolean
    manageVcsSettings: Boolean
    managePolicyOverrides: Boolean
    manageModules: Boolean
    manageProviders: Boolean
    manageRunTasks: Boolean
    manageProjects: Boolean
    manageMembership: Boolean
    manageTeams: Boolean
    manageOrganizationAccess: Boolean
    accessSecretTeams: Boolean
    readProjects: Boolean
    readWorkspaces: Boolean
    manageAgentPools: Boolean
  }

  extend type Query {
    teams(query: String!): [Team!]!
    teams(organization: String!, names: [String!]): [Team!]!
    team(id: ID!): Team
  }
`;

export default teamSchema;
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
    users(filter: UserFilter): [User!]!
    tokens(filter: TeamTokenFilter): [TeamToken!]!
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

  input TeamFilter {
    _and: [TeamFilter!]
    _or: [TeamFilter!]
    _not: TeamFilter

    id: StringComparisonExp
    name: StringComparisonExp
    ssoTeamId: StringComparisonExp
    usersCount: IntComparisonExp
    visibility: StringComparisonExp
    allowMemberTokenManagement: BooleanComparisonExp
    permissions: TeamPermissionsFilter
    organizationAccess: TeamOrganizationAccessFilter
  }


  input TeamPermissionsFilter {
    _and: [TeamPermissionsFilter!]
    _or: [TeamPermissionsFilter!]
    _not: TeamPermissionsFilter

    canUpdateMembership: BooleanComparisonExp
    canDestroy: BooleanComparisonExp
    canUpdateOrganizationAccess: BooleanComparisonExp
    canUpdateApiToken: BooleanComparisonExp
    canUpdateVisibility: BooleanComparisonExp
    canUpdateName: BooleanComparisonExp
    canUpdateSsoTeamId: BooleanComparisonExp
    canUpdateMemberTokenManagement: BooleanComparisonExp
    canViewApiToken: BooleanComparisonExp
  }

  input TeamOrganizationAccessFilter {
    _and: [TeamOrganizationAccessFilter!]
    _or: [TeamOrganizationAccessFilter!]
    _not: TeamOrganizationAccessFilter

    managePolicies: BooleanComparisonExp
    manageWorkspaces: BooleanComparisonExp
    manageVcsSettings: BooleanComparisonExp
    managePolicyOverrides: BooleanComparisonExp
    manageModules: BooleanComparisonExp
    manageProviders: BooleanComparisonExp
    manageRunTasks: BooleanComparisonExp
    manageProjects: BooleanComparisonExp
    manageMembership: BooleanComparisonExp
    manageTeams: BooleanComparisonExp
    manageOrganizationAccess: BooleanComparisonExp
    accessSecretTeams: BooleanComparisonExp
    readProjects: BooleanComparisonExp
    readWorkspaces: BooleanComparisonExp
    manageAgentPools: BooleanComparisonExp
  }

  extend type Query {
    teams(includeOrgs: [String!], excludeOrgs: [String!], filter: TeamFilter): [Team!]!
    # teams(organization: String!, filter: TeamFilter): [Team!]!
    teamsByQuery(organization: String!, query: String!, filter: TeamFilter): [Team!]!
    teamsByName(organization: String!, names: [String!]!, filter: TeamFilter): [Team!]!
    team(id: ID!): Team
  }
`;

export default teamSchema;
import { gql } from 'graphql-tag';

const organizationSchema = gql`
  type Organization {
    id: ID!
    name: String!
    externalId: String!
    email: String!
    createdAt: DateTime!
    sessionTimeout: Int
    sessionRemember: Int
    collaboratorAuthPolicy: String!
    planExpired: Boolean!
    planExpiresAt: DateTime
    planIsTrial: Boolean
    planIsEnterprise: Boolean
    planIdentifier: String
    costEstimationEnabled: Boolean!
    sendPassingStatusesForUntriggeredSpeculativePlans: Boolean!
    aggregatedCommitStatusEnabled: Boolean!
    speculativePlanManagementEnabled: Boolean!
    allowForceDeleteWorkspaces: Boolean!
    fairRunQueuingEnabled: Boolean!
    samlEnabled: Boolean!
    ownersTeamSamlRoleId: String
    twoFactorConformant: Boolean!
    assessmentsEnforced: Boolean!
    defaultExecutionMode: String!
    permissions: OrganizationPermissions!
    workspaces: [Workspace!]
  }

  type OrganizationPermissions {
    canUpdate: Boolean!
    canDestroy: Boolean!
    canAccessViaTeams: Boolean!
    canCreateModule: Boolean!
    canCreateTeam: Boolean!
    canCreateWorkspace: Boolean!
    canManageUsers: Boolean!
    canManageSubscription: Boolean!
    canManageSso: Boolean!
    canUpdateOauth: Boolean!
    canUpdateSentinel: Boolean!
    canUpdateSshKeys: Boolean!
    canUpdateApiToken: Boolean!
    canTraverse: Boolean!
    canStartTrial: Boolean!
    canUpdateAgentPools: Boolean!
    canManageTags: Boolean!
    canManageVarsets: Boolean!
    canReadVarsets: Boolean!
    canManagePublicProviders: Boolean!
    canCreateProvider: Boolean!
    canManagePublicModules: Boolean!
    canManageCustomProviders: Boolean!
    canManageRunTasks: Boolean!
    canReadRunTasks: Boolean!
    canCreateProject: Boolean!
  }

  extend type Query {
    organizations: [Organization!]!
    organization(name: String!): Organization
  }
`;
export default organizationSchema;
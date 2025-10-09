import { gql } from "graphql-tag";

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
    workspaces(filter: WorkspaceFilter): [Workspace!]
    teams(filter: TeamFilter): [Team!]
    users(filter: UserFilter): [User!]
    variableSets(filter: VariableSetFilter): [VariableSet!]
    memberships(
      filter: OrganizationMembershipFilter
    ): [OrganizationMembership!]!
    tags(filter: OrganizationTagFilter): [OrganizationTag!]!
    policySets(filter: PolicySetFilter): [PolicySet!]
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

  input OrganizationPermissionsFilter {
    _and: [OrganizationFilter!]
    _or: [OrganizationFilter!]
    _not: OrganizationFilter

    canUpdate: BooleanComparisonExp
    canDestroy: BooleanComparisonExp
    canAccessViaTeams: BooleanComparisonExp
    canCreateModule: BooleanComparisonExp
    canCreateTeam: BooleanComparisonExp
    canCreateWorkspace: BooleanComparisonExp
    canManageUsers: BooleanComparisonExp
    canManageSubscription: BooleanComparisonExp
    canManageSso: BooleanComparisonExp
    canUpdateOauth: BooleanComparisonExp
    canUpdateSentinel: BooleanComparisonExp
    canUpdateSshKeys: BooleanComparisonExp
    canUpdateApiToken: BooleanComparisonExp
    canTraverse: BooleanComparisonExp
    canStartTrial: BooleanComparisonExp
    canUpdateAgentPools: BooleanComparisonExp
    canManageTags: BooleanComparisonExp
    canManageVarsets: BooleanComparisonExp
    canReadVarsets: BooleanComparisonExp
    canManagePublicProviders: BooleanComparisonExp
    canCreateProvider: BooleanComparisonExp
    canManagePublicModules: BooleanComparisonExp
    canManageCustomProviders: BooleanComparisonExp
    canManageRunTasks: BooleanComparisonExp
    canReadRunTasks: BooleanComparisonExp
    canCreateProject: BooleanComparisonExp
  }

  input OrganizationFilter {
    _and: [OrganizationFilter!]
    _or: [OrganizationFilter!]
    _not: OrganizationFilter

    id: StringComparisonExp
    name: StringComparisonExp
    externalId: StringComparisonExp
    email: StringComparisonExp
    createdAt: DateTimeComparisonExp
    sessionTimeout: IntComparisonExp
    sessionRemember: IntComparisonExp
    collaboratorAuthPolicy: StringComparisonExp
    planExpired: BooleanComparisonExp
    planExpiresAt: DateTimeComparisonExp
    planIsTrial: BooleanComparisonExp
    planIsEnterprise: BooleanComparisonExp
    planIdentifier: StringComparisonExp
    costEstimationEnabled: BooleanComparisonExp
    sendPassingStatusesForUntriggeredSpeculativePlans: BooleanComparisonExp
    aggregatedCommitStatusEnabled: BooleanComparisonExp
    speculativePlanManagementEnabled: BooleanComparisonExp
    allowForceDeleteWorkspaces: BooleanComparisonExp
    fairRunQueuingEnabled: BooleanComparisonExp
    samlEnabled: BooleanComparisonExp
    ownersTeamSamlRoleId: StringComparisonExp
    twoFactorConformant: BooleanComparisonExp
    assessmentsEnforced: BooleanComparisonExp
    defaultExecutionMode: StringComparisonExp

    permissions: OrganizationPermissionsFilter
  }

  extend type Query {
    organizations(filter: OrganizationFilter): [Organization!]!
    organization(name: String!): Organization
  }
`;
export default organizationSchema;

import { gql } from "graphql-tag";

const organizationSchema = gql`
  """
  A shared space for teams to collaborate on workspaces in HCP Terraform. Organizations manage access, settings, and billing.
  """
  type Organization {
    """The organization's unique identifier."""
    id: ID!
    """The organization name."""
    name: String!
    """External identifier for the organization."""
    externalId: String!
    """Admin notification email address for the organization."""
    email: String!
    """Timestamp when the organization was created."""
    createdAt: DateTime!
    """Session timeout after inactivity, in minutes."""
    sessionTimeout: Int
    """Session expiration duration, in minutes."""
    sessionRemember: Int
    """Authentication policy for the organization. Either 'password' or 'two_factor_mandatory'."""
    collaboratorAuthPolicy: String!
    """Whether the current subscription plan has expired."""
    planExpired: Boolean!
    """Timestamp when the subscription plan expires."""
    planExpiresAt: DateTime
    """Whether the organization is on a trial plan."""
    planIsTrial: Boolean
    """Whether the organization is on an enterprise plan."""
    planIsEnterprise: Boolean
    """The identifier of the current subscription plan tier."""
    planIdentifier: String
    """Whether cost estimation is available for the organization."""
    costEstimationEnabled: Boolean!
    """Whether VCS status updates are sent for untriggered speculative plans."""
    sendPassingStatusesForUntriggeredSpeculativePlans: Boolean!
    """Whether to aggregate VCS commit statuses for triggered workspaces."""
    aggregatedCommitStatusEnabled: Boolean!
    """Whether automatic cancellation of plan-only runs is enabled."""
    speculativePlanManagementEnabled: Boolean!
    """Whether workspace admins can delete workspaces that still have managed resources."""
    allowForceDeleteWorkspaces: Boolean!
    """Whether fair run queue scheduling is enabled."""
    fairRunQueuingEnabled: Boolean!
    """Whether SAML single sign-on is enabled for the organization."""
    samlEnabled: Boolean!
    """The SAML role ID mapped to the owners team."""
    ownersTeamSamlRoleId: String
    """Whether the organization complies with two-factor authentication requirements."""
    twoFactorConformant: Boolean!
    """Whether health assessments are enforced for all eligible workspaces."""
    assessmentsEnforced: Boolean!
    """Default execution mode for new workspaces: 'remote', 'local', or 'agent'."""
    defaultExecutionMode: String!
    """Permissions the current user has on this organization."""
    permissions: OrganizationPermissions!
    """Workspaces belonging to this organization, with optional filtering."""
    workspaces(filter: WorkspaceFilter): [Workspace!]
    """Teams within this organization, with optional filtering."""
    teams(filter: TeamFilter): [Team!]
    """Users who are members of this organization, with optional filtering."""
    users(filter: UserFilter): [User!]
    """Variable sets defined in this organization, with optional filtering."""
    variableSets(filter: VariableSetFilter): [VariableSet!]
    """Organization memberships (user invitations and active members)."""
    memberships(
      filter: OrganizationMembershipFilter
    ): [OrganizationMembership!]!
    """Tags defined in this organization for classifying workspaces."""
    tags(filter: OrganizationTagFilter): [OrganizationTag!]!
    """Policy sets configured in this organization."""
    policySets(filter: PolicySetFilter): [PolicySet!]
    """Users retrieved via the Terraform Enterprise admin API. Only available on TFE."""
    usersFromAdmin(filter: UserFilter): [AdminUser!] @tfeOnly
    """Projects within this organization, with optional filtering."""
    projects(filter: ProjectFilter): [Project!]
  }

  """
  Permissions the current API token has on an organization, controlling which management operations are allowed.
  """
  type OrganizationPermissions {
    """Whether the current user can modify organization settings."""
    canUpdate: Boolean!
    """Whether the current user can delete the organization."""
    canDestroy: Boolean!
    """Whether the current user accesses the organization through team membership."""
    canAccessViaTeams: Boolean!
    """Whether the current user can publish private registry modules."""
    canCreateModule: Boolean!
    """Whether the current user can create new teams."""
    canCreateTeam: Boolean!
    """Whether the current user can create new workspaces."""
    canCreateWorkspace: Boolean!
    """Whether the current user can manage organization user memberships."""
    canManageUsers: Boolean!
    """Whether the current user can manage the organization subscription."""
    canManageSubscription: Boolean!
    """Whether the current user can configure single sign-on settings."""
    canManageSso: Boolean!
    """Whether the current user can manage OAuth client connections."""
    canUpdateOauth: Boolean!
    """Whether the current user can manage Sentinel policy configuration."""
    canUpdateSentinel: Boolean!
    """Whether the current user can manage SSH keys."""
    canUpdateSshKeys: Boolean!
    """Whether the current user can manage the organization API token."""
    canUpdateApiToken: Boolean!
    """Whether the current user can traverse (list) the organization."""
    canTraverse: Boolean!
    """Whether the current user can start a trial plan."""
    canStartTrial: Boolean!
    """Whether the current user can manage agent pools."""
    canUpdateAgentPools: Boolean!
    """Whether the current user can manage organization tags."""
    canManageTags: Boolean!
    """Whether the current user can manage variable sets."""
    canManageVarsets: Boolean!
    """Whether the current user can view variable sets."""
    canReadVarsets: Boolean!
    """Whether the current user can manage public provider listings."""
    canManagePublicProviders: Boolean!
    """Whether the current user can create private providers."""
    canCreateProvider: Boolean!
    """Whether the current user can manage public module listings."""
    canManagePublicModules: Boolean!
    """Whether the current user can manage custom provider configurations."""
    canManageCustomProviders: Boolean!
    """Whether the current user can manage run task configurations."""
    canManageRunTasks: Boolean!
    """Whether the current user can view run task configurations."""
    canReadRunTasks: Boolean!
    """Whether the current user can create new projects."""
    canCreateProject: Boolean!
  }

  """
  Filter conditions for Organization.permissions fields.
  """
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

  """
  Filter conditions for Organization queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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
    """
    List all organizations accessible to the authenticated user.
    """
    organizations(filter: OrganizationFilter): [Organization!]!
    """
    Look up a single organization by name.
    """
    organization(name: String!): Organization
  }
`;
export default organizationSchema;

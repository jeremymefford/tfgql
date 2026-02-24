import { gql } from "graphql-tag";

const teamSchema = gql`
  """
  A group of HCP Terraform users with shared permissions. Teams can be granted access to workspaces and projects within an organization.
  """
  type Team {
    """The team's unique identifier."""
    id: ID!
    """The team name. Supports letters, numbers, hyphens, and underscores."""
    name: String!
    """The unique identifier from the SAML MemberOf attribute, used for SSO team mapping."""
    ssoTeamId: String
    """Number of users in this team."""
    usersCount: Int!
    """The team's visibility: 'secret' (only visible to members and org admins) or 'organization' (visible to all members)."""
    visibility: String!
    """Whether team members can manage the team's API tokens."""
    allowMemberTokenManagement: Boolean!
    """Permissions the current user has on this team."""
    permissions: TeamPermissions!
    """Organization-level permissions granted to this team."""
    organizationAccess: TeamOrganizationAccess!
    """The organization this team belongs to."""
    organization: Organization!
    """Users who are members of this team."""
    users(filter: UserFilter): [User!]!
    """Users retrieved via the Terraform Enterprise admin API. Only available on TFE."""
    usersFromAdmin(filter: UserFilter): [AdminUser!] @tfeOnly
    """API tokens associated with this team."""
    tokens(filter: TeamTokenFilter): [TeamToken!]!
    """Workspace-level access grants for this team."""
    workspaceAccess(filter: WorkspaceTeamAccessFilter): [WorkspaceTeamAccess!]!
    """Project-level access grants for this team."""
    projectAccess(filter: ProjectTeamAccessFilter): [ProjectTeamAccess!]!
  }

  """
  Permissions the current API token has on a team, controlling which management operations are allowed.
  """
  type TeamPermissions {
    """Whether the current user can modify team members."""
    canUpdateMembership: Boolean
    """Whether the current user can delete this team."""
    canDestroy: Boolean
    """Whether the current user can adjust this team's organization-level permissions."""
    canUpdateOrganizationAccess: Boolean
    """Whether the current user can manage this team's API tokens."""
    canUpdateApiToken: Boolean
    """Whether the current user can change this team's visibility setting."""
    canUpdateVisibility: Boolean
    """Whether the current user can rename this team."""
    canUpdateName: Boolean
    """Whether the current user can update this team's SSO team ID mapping."""
    canUpdateSsoTeamId: Boolean
    """Whether the current user can change the member token management setting."""
    canUpdateMemberTokenManagement: Boolean
    """Whether the current user can view this team's API token metadata."""
    canViewApiToken: Boolean
  }

  """
  Organization-level permissions granted to a team, controlling what the team can manage across the organization.
  """
  type TeamOrganizationAccess {
    """Whether this team can manage Sentinel and OPA policies."""
    managePolicies: Boolean
    """Whether this team can create and manage workspaces."""
    manageWorkspaces: Boolean
    """Whether this team can manage VCS provider connections."""
    manageVcsSettings: Boolean
    """Whether this team can override failed policy checks."""
    managePolicyOverrides: Boolean
    """Whether this team can manage private registry modules."""
    manageModules: Boolean
    """Whether this team can manage private registry providers."""
    manageProviders: Boolean
    """Whether this team can manage run task configurations."""
    manageRunTasks: Boolean
    """Whether this team can create and manage projects."""
    manageProjects: Boolean
    """Whether this team can manage organization user memberships."""
    manageMembership: Boolean
    """Whether this team can administer other teams."""
    manageTeams: Boolean
    """Whether this team can assign organization-level permissions to other teams."""
    manageOrganizationAccess: Boolean
    """Whether this team can view secret (hidden) teams."""
    accessSecretTeams: Boolean
    """Whether this team can view projects."""
    readProjects: Boolean
    """Whether this team can view workspaces."""
    readWorkspaces: Boolean
    """Whether this team can manage agent pools."""
    manageAgentPools: Boolean
  }

  """
  Filter conditions for Team queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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

  """
  Filter conditions for Team.permissions fields.
  """
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

  """
  Filter conditions for Team.organizationAccess fields.
  """
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
    """
    List all teams across the selected organizations.
    """
    teams(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: TeamFilter
    ): [Team!]!
    """
    Search teams within an organization by name query string.
    """
    teamsByQuery(
      organization: String!
      query: String!
      filter: TeamFilter
    ): [Team!]!
    """
    Look up specific teams within an organization by exact name.
    """
    teamsByName(
      organization: String!
      names: [String!]!
      filter: TeamFilter
    ): [Team!]!
    """
    Look up a single team by ID.
    """
    team(id: ID!): Team
  }
`;

export default teamSchema;

import { gql } from "graphql-tag";

const userSchema = gql`
  """
  Common fields shared by regular users and admin-managed users.
  """
  interface UserAccount {
    """The user's unique identifier."""
    id: ID!
    """The user's login name."""
    username: String!
    """The user's email address."""
    email: String
    """URL to the user's Gravatar profile image."""
    avatarUrl: String
    """Whether this is a synthetic service account rather than a human user."""
    isServiceAccount: Boolean!
    """Teams the user belongs to across organizations."""
    teams(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: TeamFilter
    ): [Team!]!
  }

  """
  An HCP Terraform user account. User objects contain username, avatar, and permission information but not other personal identifying details.
  """
  type User implements UserAccount {
    """The user's unique identifier."""
    id: ID!
    """The user's login name."""
    username: String!
    """The user's email address."""
    email: String
    """URL to the user's Gravatar profile image."""
    avatarUrl: String
    """Whether this is a synthetic service account rather than a human user."""
    isServiceAccount: Boolean!
    """The authentication method used (e.g., 'tfc', 'hcp_username_password', 'hcp_github')."""
    authMethod: String!
    """Whether the user only has access to the v2 API."""
    v2Only: Boolean!
    """Permissions the current user has on this user account."""
    permissions: UserPermissions!
    """Teams the user belongs to across organizations."""
    teams(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: TeamFilter
    ): [Team!]!
  }

  """
  Permissions on a user account, controlling which account management operations are allowed.
  """
  type UserPermissions {
    """Whether the user can create new organizations."""
    canCreateOrganizations: Boolean!
    """Whether the user can view their account settings."""
    canViewSettings: Boolean!
    """Whether the user can view their profile."""
    canViewProfile: Boolean!
    """Whether the user can modify their email address."""
    canChangeEmail: Boolean!
    """Whether the user can modify their username."""
    canChangeUsername: Boolean!
    """Whether the user can change their password."""
    canChangePassword: Boolean!
    """Whether the user can manage their active sessions."""
    canManageSessions: Boolean!
    """Whether the user can manage their SSO identity links."""
    canManageSsoIdentities: Boolean!
    """Whether the user can manage their personal API tokens."""
    canManageUserTokens: Boolean!
    """Whether the user can update their account details."""
    canUpdateUser: Boolean!
    """Whether the user can re-enable two-factor authentication by unlinking an identity."""
    canReenable2faByUnlinking: Boolean!
    """Whether the user can manage their linked HCP account."""
    canManageHcpAccount: Boolean!
  }

  """
  Filter conditions for User.permissions fields.
  """
  input UserPermissionsFilter {
    _and: [UserPermissionsFilter!]
    _or: [UserPermissionsFilter!]
    _not: UserPermissionsFilter

    canCreateOrganizations: BooleanComparisonExp
    canViewSettings: BooleanComparisonExp
    canViewProfile: BooleanComparisonExp
    canChangeEmail: BooleanComparisonExp
    canChangeUsername: BooleanComparisonExp
    canChangePassword: BooleanComparisonExp
    canManageSessions: BooleanComparisonExp
    canManageSsoIdentities: BooleanComparisonExp
    canManageUserTokens: BooleanComparisonExp
    canUpdateUser: BooleanComparisonExp
    canReenable2faByUnlinking: BooleanComparisonExp
    canManageHcpAccount: BooleanComparisonExp
  }

  """
  Filter conditions for User queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input UserFilter {
    _and: [UserFilter!]
    _or: [UserFilter!]
    _not: UserFilter

    id: StringComparisonExp
    username: StringComparisonExp
    email: StringComparisonExp
    avatarUrl: StringComparisonExp
    isServiceAccount: BooleanComparisonExp
    authMethod: StringComparisonExp
    v2Only: BooleanComparisonExp
    permissions: UserPermissionsFilter
  }

  extend type Query {
    """
    Look up a single user by ID.
    """
    user(id: ID!): User
    """
    Get the currently authenticated user's account details.
    """
    me: User
  }
`;

export default userSchema;

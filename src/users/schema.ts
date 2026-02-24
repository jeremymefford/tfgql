import { gql } from "graphql-tag";

const userSchema = gql`
  """
  Common fields shared by regular users and admin-managed users.
  """
  interface UserAccount {
    id: ID!
    username: String!
    email: String
    avatarUrl: String
    isServiceAccount: Boolean!
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
    id: ID!
    username: String!
    email: String
    avatarUrl: String
    isServiceAccount: Boolean!
    authMethod: String!
    v2Only: Boolean!
    permissions: UserPermissions!
    teams(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: TeamFilter
    ): [Team!]!
  }

  type UserPermissions {
    canCreateOrganizations: Boolean!
    canViewSettings: Boolean!
    canViewProfile: Boolean!
    canChangeEmail: Boolean!
    canChangeUsername: Boolean!
    canChangePassword: Boolean!
    canManageSessions: Boolean!
    canManageSsoIdentities: Boolean!
    canManageUserTokens: Boolean!
    canUpdateUser: Boolean!
    canReenable2faByUnlinking: Boolean!
    canManageHcpAccount: Boolean!
  }

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

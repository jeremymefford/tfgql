import { gql } from 'graphql-tag';

const userSchema = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    avatarUrl: String
    isServiceAccount: Boolean!
    authMethod: String!
    v2Only: Boolean!
    permissions: UserPermissions!
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
    user(id: ID!): User
    me: User
  }
`;

export default userSchema;
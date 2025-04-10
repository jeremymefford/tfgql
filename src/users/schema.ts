import { gql } from 'graphql-tag';

const userSchema = gql`
  type User {
    id: ID!
    username: String!
    email: String
    avatarUrl: String
    isServiceAccount: Boolean!
    authMethod: String
    v2Only: Boolean
    permissions: UserPermissions!
  }

  type UserPermissions {
    canCreateOrganizations: Boolean
    canChangeEmail: Boolean
    canChangeUsername: Boolean
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
  }

  extend type Query {
    user(id: ID!): User
    me: User
  }
`;

export default userSchema;
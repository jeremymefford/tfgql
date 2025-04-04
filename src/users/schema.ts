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
    canChangeEmail: Boolean!
    canChangeUsername: Boolean!
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
    me: User
  }
`;

export default userSchema;
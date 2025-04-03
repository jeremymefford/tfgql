import { gql } from 'graphql-tag';

const userSchema = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    avatarUrl: String
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
    me: User
  }
`;

export default userSchema;
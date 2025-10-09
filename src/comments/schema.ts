import { gql } from "graphql-tag";

const commentsSchema = gql`
  type Comment {
    id: ID!
    body: String!
    runEventId: ID
  }

  input CommentFilter {
    _and: [CommentFilter!]
    _or: [CommentFilter!]
    _not: CommentFilter

    body: StringComparisonExp
  }

  extend type Query {
    comments(runId: ID!, filter: CommentFilter): [Comment!]!
    comment(id: ID!): Comment
  }
`;

export default commentsSchema;

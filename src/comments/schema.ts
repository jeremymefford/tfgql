import { gql } from 'graphql-tag';

const commentsSchema = gql`
  type Comment {
    id: ID!
    # The text body of the comment
    body: String!
    # ID of the associated run-event
    runEventId: ID
  }

  input CommentFilter {
    _and: [CommentFilter!]
    _or: [CommentFilter!]
    _not: CommentFilter

    # Filter by comment ID
    id: StringComparisonExp
    # Filter by comment body text
    body: StringComparisonExp
  }

  extend type Query {
    comments(runId: ID!, filter: CommentFilter): [Comment!]!
    comment(id: ID!): Comment
  }
`;

export default commentsSchema;
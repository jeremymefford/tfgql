import { gql } from "graphql-tag";

const commentsSchema = gql`
  """
  A comment left on a Terraform run. Comments appear in the run timeline and can be used for review discussions.
  """
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
    """
    List all comments on a specific run.
    """
    comments(runId: ID!, filter: CommentFilter): [Comment!]!
    """
    Look up a single comment by ID.
    """
    comment(id: ID!): Comment
  }
`;

export default commentsSchema;

import { gql } from "graphql-tag";

const commentsSchema = gql`
  """
  A comment left on a Terraform run. Comments appear in the run timeline and can be used for review discussions.
  """
  type Comment {
    """The comment's unique identifier."""
    id: ID!
    """The text content of the comment."""
    body: String!
    """The ID of the run event this comment is associated with."""
    runEventId: ID
  }

  """
  Filter conditions for Comment queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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

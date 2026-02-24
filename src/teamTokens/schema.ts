import { gql } from "graphql-tag";

const teamTokensSchema = gql`
  """
  An API token associated with a team. Team tokens can be used to authenticate API requests on behalf of the team.
  """
  type TeamToken {
    """The team token's unique identifier."""
    id: ID!
    """The ID of the team this token belongs to."""
    teamId: ID!
    """Timestamp when the token was created."""
    createdAt: DateTime!
    """Timestamp when the token was last used, or null if never used."""
    lastUsedAt: DateTime
    """A text label for the token. Must be unique within the team."""
    description: String
    """The secret authentication string. Only visible upon creation and cannot be recovered."""
    token: String
    """The expiration timestamp. Null if the token never expires."""
    expiredAt: DateTime
    """The ID of the user who created this token."""
    createdById: ID!
  }

  """
  Filter conditions for TeamToken queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input TeamTokenFilter {
    _and: [TeamTokenFilter!]
    _or: [TeamTokenFilter!]
    _not: TeamTokenFilter

    id: StringComparisonExp
    teamId: StringComparisonExp
    createdAt: DateTimeComparisonExp
    lastUsedAt: DateTimeComparisonExp
    description: StringComparisonExp
    token: StringComparisonExp
    expiredAt: DateTimeComparisonExp
    createdById: StringComparisonExp
  }

  extend type Query {
    """
    List all API tokens for a specific team.
    """
    teamTokens(teamId: ID!, filter: TeamTokenFilter): [TeamToken!]!
    """
    Look up a single team token by ID.
    """
    teamToken(id: ID!): TeamToken
  }
`;

export default teamTokensSchema;

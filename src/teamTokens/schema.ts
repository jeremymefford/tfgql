import { gql } from "graphql-tag";

const teamTokensSchema = gql`
  """
  An API token associated with a team. Team tokens can be used to authenticate API requests on behalf of the team.
  """
  type TeamToken {
    id: ID!
    teamId: ID!
    createdAt: DateTime!
    lastUsedAt: DateTime
    description: String
    token: String
    expiredAt: DateTime
    createdById: ID!
  }

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

import { gql } from "graphql-tag";

const agentTokensSchema = gql`
  """
  An authentication token used by agents to register with an agent pool.
  """
  type AgentToken {
    """The agent token's unique identifier."""
    id: ID!
    """The ID of the agent pool this token belongs to."""
    poolId: String
    """Timestamp when the token was created."""
    createdAt: DateTime!
    """Timestamp when the token was last used, or null if never used."""
    lastUsedAt: DateTime
    """A text label describing the token's purpose."""
    description: String!
    """The ID of the user who created this token."""
    createdById: ID!
  }

  """
  Filter conditions for AgentToken queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input AgentTokenFilter {
    _and: [AgentTokenFilter!]
    _or: [AgentTokenFilter!]
    _not: AgentTokenFilter

    id: StringComparisonExp
    poolId: StringComparisonExp
    createdAt: DateTimeComparisonExp
    lastUsedAt: DateTimeComparisonExp
    description: StringComparisonExp
    createdById: StringComparisonExp
  }

  extend type Query {
    """
    List all authentication tokens for a specific agent pool.
    """
    agentTokens(poolId: ID!, filter: AgentTokenFilter): [AgentToken!]!
    """
    Look up a single agent token by ID.
    """
    agentToken(id: ID!): AgentToken
  }
`;

export default agentTokensSchema;

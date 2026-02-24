import { gql } from "graphql-tag";

const agentTokensSchema = gql`
  """
  An authentication token used by agents to register with an agent pool.
  """
  type AgentToken {
    id: ID!
    poolId: String
    createdAt: DateTime!
    lastUsedAt: DateTime
    description: String!
    createdById: ID!
  }

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

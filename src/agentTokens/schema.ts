import { gql } from 'graphql-tag';

const agentTokensSchema = gql`
  type AgentToken {
    id: ID!
    createdAt: DateTime!
    lastUsedAt: DateTime
    description: String!
    token: String
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
    token: StringComparisonExp
    createdById: StringComparisonExp
  }

  extend type Query {
    agentTokens(poolId: ID!, filter: AgentTokenFilter): [AgentToken!]!
    agentToken(id: ID!): AgentToken
  }
`;

export default agentTokensSchema;
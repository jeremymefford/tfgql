import { gql } from 'graphql-tag';

const agentSchema = gql`
  type Agent {
    id: ID!
    name: String
    status: String!
    ipAddress: String!
    lastPingAt: DateTime!
  }

  input AgentFilter {
    _and: [AgentFilter!]
    _or: [AgentFilter!]
    _not: AgentFilter

    id: StringComparisonExp
    name: StringComparisonExp
    status: StringComparisonExp
    ipAddress: StringComparisonExp
    lastPingAt: DateTimeComparisonExp
  }

  extend type Query {
    agents(poolId: ID!, filter: AgentFilter): [Agent!]!
    agent(id: ID!): Agent
  }
`;

export default agentSchema;
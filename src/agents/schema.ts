import { gql } from "graphql-tag";

const agentSchema = gql`
  """
  A Terraform Cloud agent that executes runs on isolated, private, or on-premises infrastructure. Agents connect to HCP Terraform and are organized into agent pools.
  """
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
    """
    List all agents registered in a specific agent pool.
    """
    agents(poolId: ID!, filter: AgentFilter): [Agent!]!
    """
    Look up a single agent by ID.
    """
    agent(id: ID!): Agent
  }
`;

export default agentSchema;

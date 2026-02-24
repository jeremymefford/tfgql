import { gql } from "graphql-tag";

const agentSchema = gql`
  """
  A Terraform Cloud agent that executes runs on isolated, private, or on-premises infrastructure. Agents connect to HCP Terraform and are organized into agent pools.
  """
  type Agent {
    """The agent's unique identifier."""
    id: ID!
    """The agent's display name."""
    name: String
    """Current state of the agent: 'idle', 'busy', 'unknown', 'exited', or 'errored'."""
    status: String!
    """The agent's IP address."""
    ipAddress: String!
    """Timestamp of the most recent communication from the agent."""
    lastPingAt: DateTime!
  }

  """
  Filter conditions for Agent queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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

import { gql } from "graphql-tag";

const agentPoolsSchema = gql`
  """
  A group of agents, often sharing a common network segment or purpose. Workspaces can be configured to use an agent pool for remote operations with isolated infrastructure.
  """
  type AgentPool {
    """The agent pool's unique identifier."""
    id: ID!
    """The resource type identifier."""
    type: String!
    """The agent pool name. Must be unique per organization."""
    name: String!
    """Timestamp when the agent pool was created."""
    createdAt: DateTime!
    """When true, all workspaces in the organization can use this agent pool."""
    organizationScoped: Boolean!
    """
    The name of the organization this agent pool belongs to.
    """
    organizationName: String
    """Number of agents in idle, busy, or unknown states."""
    agentCount: Int!
    """Workspaces currently configured to use this agent pool."""
    workspaces(filter: WorkspaceFilter): [Workspace!]!
    """Workspaces explicitly allowed to use this agent pool."""
    allowedWorkspaces(filter: WorkspaceFilter): [Workspace!]!
    """Agents registered in this pool."""
    agents(filter: AgentFilter): [Agent!]!
    """Authentication tokens used by agents to connect to this pool."""
    authenticationTokens(filter: AgentTokenFilter): [AgentToken!]!
  }

  """
  Filter conditions for AgentPool queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
  input AgentPoolFilter {
    _and: [AgentPoolFilter!]
    _or: [AgentPoolFilter!]
    _not: AgentPoolFilter

    id: StringComparisonExp
    type: StringComparisonExp
    name: StringComparisonExp
    createdAt: DateTimeComparisonExp
    organizationScoped: BooleanComparisonExp
    agentCount: IntComparisonExp
  }

  extend type Query {
    """
    List all agent pools across the selected organizations.
    """
    agentPools(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: AgentPoolFilter
    ): [AgentPool!]!
    """
    Look up a single agent pool by ID.
    """
    agentPool(id: ID!): AgentPool
  }
`;

export default agentPoolsSchema;

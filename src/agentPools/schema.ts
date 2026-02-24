import { gql } from "graphql-tag";

const agentPoolsSchema = gql`
  """
  A group of agents, often sharing a common network segment or purpose. Workspaces can be configured to use an agent pool for remote operations with isolated infrastructure.
  """
  type AgentPool {
    id: ID!
    type: String!
    name: String!
    createdAt: DateTime!
    organizationScoped: Boolean!
    """
    The name of the organization this agent pool belongs to.
    """
    organizationName: String
    agentCount: Int!
    workspaces(filter: WorkspaceFilter): [Workspace!]!
    allowedWorkspaces(filter: WorkspaceFilter): [Workspace!]!
    agents(filter: AgentFilter): [Agent!]!
    authenticationTokens(filter: AgentTokenFilter): [AgentToken!]!
  }

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

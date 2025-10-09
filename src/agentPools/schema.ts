import { gql } from "graphql-tag";

const agentPoolsSchema = gql`
  type AgentPool {
    id: ID!
    type: String!
    name: String!
    createdAt: DateTime!
    organizationScoped: Boolean!
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
    agentPools(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      filter: AgentPoolFilter
    ): [AgentPool!]!
    agentPool(id: ID!): AgentPool
  }
`;

export default agentPoolsSchema;

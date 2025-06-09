import { gql } from 'graphql-tag';

const agentTokensSchema = gql`
  type AgentToken {
    id: ID!
    # TODO: add AgentToken fields based on Terraform Cloud API
  }

  input AgentTokenFilter {
    _and: [AgentTokenFilter!]
    _or: [AgentTokenFilter!]
    _not: AgentTokenFilter

    # TODO: add filter fields based on Terraform Cloud API
  }

  extend type Query {
    agentTokens(poolId: ID!, filter: AgentTokenFilter): [AgentToken!]!
    agentToken(id: ID!): AgentToken
  }
`;

export default agentTokensSchema;
import { gql } from 'graphql-tag';

const appliesSchema = gql`
  type Apply {
    id: ID!
    mode: String!
    agentId: String
    agentName: String
    agentPoolId: String
    agentPoolName: String
    status: String!
    queuedAt: DateTime!
    startedAt: DateTime!
    finishedAt: DateTime!
    logReadUrl: String!
    resourceAdditions: Int!
    resourceChanges: Int!
    resourceDestructions: Int!
    resourceImports: Int!
    stateVersionIds: [ID!]!
  }

  input ApplyFilter {
    _and: [ApplyFilter!]
    _or: [ApplyFilter!]
    _not: ApplyFilter

    id: StringComparisonExp
    mode: StringComparisonExp
    agentId: StringComparisonExp
    agentName: StringComparisonExp
    agentPoolId: StringComparisonExp
    agentPoolName: StringComparisonExp
    status: StringComparisonExp
    queuedAt: DateTimeComparisonExp
    startedAt: DateTimeComparisonExp
    finishedAt: DateTimeComparisonExp
    logReadUrl: StringComparisonExp
    resourceAdditions: IntComparisonExp
    resourceChanges: IntComparisonExp
    resourceDestructions: IntComparisonExp
    resourceImports: IntComparisonExp
    stateVersionIds: StringComparisonExp
  }

  extend type Query {
    applies(runId: ID!, filter: ApplyFilter): [Apply!]!
    apply(id: ID!): Apply
  }
`;

export default appliesSchema;
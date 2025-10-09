import { gql } from "graphql-tag";

const plansSchema = gql`
  type Plan {
    id: ID!
    mode: String!
    agentId: ID
    agentName: String
    agentPoolId: ID
    agentPoolName: String
    generatedConfiguration: Boolean!
    hasChanges: Boolean!
    resourceAdditions: Int!
    resourceChanges: Int!
    resourceDestructions: Int!
    resourceImports: Int!
    status: String!
    logReadUrl: String!
    planExportDownloadUrl: String
    structuredRunOutputEnabled: Boolean!
    jsonOutputUrl: String
    jsonOutputRedacted: String
    jsonSchema: String
    agentQueuedAt: DateTime
    pendingAt: DateTime
    startedAt: DateTime
    finishedAt: DateTime
  }

  input PlanFilter {
    _and: [PlanFilter!]
    _or: [PlanFilter!]
    _not: PlanFilter

    id: StringComparisonExp
    status: StringComparisonExp
    generatedConfiguration: BooleanComparisonExp
    hasChanges: BooleanComparisonExp
    resourceAdditions: IntComparisonExp
    resourceChanges: IntComparisonExp
    resourceDestructions: IntComparisonExp
    resourceImports: IntComparisonExp
    queuedAt: DateTimeComparisonExp
    pendingAt: DateTimeComparisonExp
    startedAt: DateTimeComparisonExp
    finishedAt: DateTimeComparisonExp
    mode: StringComparisonExp
    agentId: StringComparisonExp
    agentName: StringComparisonExp
    agentPoolId: StringComparisonExp
    agentPoolName: StringComparisonExp
  }

  extend type Query {
    plan(id: ID!): Plan
  }
`;

export default plansSchema;

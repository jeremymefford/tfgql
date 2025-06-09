import { gql } from 'graphql-tag';

const plansSchema = gql`
  """
  Details about how a Terraform run's plan will be or did execute.
  """
  type PlanExecutionDetails {
    mode: String!
    agentId: ID
    agentName: String
    agentPoolId: ID
    agentPoolName: String
  }

  """
  Timestamps for each plan status transition.
  """
  type PlanStatusTimestamps {
    queuedAt: DateTime!
    pendingAt: DateTime!
    startedAt: DateTime!
    finishedAt: DateTime!
  }

  """
  A Terraform execution plan for a run, including summary counts and status.
  """
  type Plan {
    id: ID!
    executionDetails: PlanExecutionDetails!
    generatedConfiguration: Boolean!
    hasChanges: Boolean!
    resourceAdditions: Int!
    resourceChanges: Int!
    resourceDestructions: Int!
    resourceImports: Int!
    status: String!
    statusTimestamps: PlanStatusTimestamps!
    logReadUrl: String!
    stateVersions(filter: StateVersionOutputFilter): [StateVersionOutput!]!
    jsonOutputUrl: String!
  }

  input PlanExecutionDetailsFilter {
    mode: StringComparisonExp
    agentId: StringComparisonExp
    agentName: StringComparisonExp
    agentPoolId: StringComparisonExp
    agentPoolName: StringComparisonExp
  }

  input PlanStatusTimestampsFilter {
    queuedAt: DateTimeComparisonExp
    pendingAt: DateTimeComparisonExp
    startedAt: DateTimeComparisonExp
    finishedAt: DateTimeComparisonExp
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
    executionDetails: PlanExecutionDetailsFilter
    statusTimestamps: PlanStatusTimestampsFilter
    logReadUrl: StringComparisonExp
  }

  extend type Query {
    plans(runId: ID!, filter: PlanFilter): [Plan!]!
    plan(id: ID!): Plan
  }
`;

export default plansSchema;
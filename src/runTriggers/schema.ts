import { gql } from 'graphql-tag';

const runTriggersSchema = gql`
  """
  Inbound or outbound run-trigger connections between workspaces.
  """
  type RunTrigger {
    id: ID!
    workspaceName: String!
    sourceableName: String!
    createdAt: DateTime!
    workspace: Workspace!
    sourceable: Workspace!
  }

  input RunTriggerFilter {
    _and: [RunTriggerFilter!]
    _or: [RunTriggerFilter!]
    _not: RunTriggerFilter

    id: StringComparisonExp
    workspaceName: StringComparisonExp
    sourceableName: StringComparisonExp
    createdAt: DateTimeComparisonExp
  }

  extend type Query {
    runTriggers(
      workspaceId: ID!
      filter: RunTriggerFilter
    ): [RunTrigger!]!
    runTrigger(id: ID!): RunTrigger
  }
`;

export default runTriggersSchema;
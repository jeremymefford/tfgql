import { gql } from 'graphql-tag';

const runTriggersSchema = gql`
  """
  Inbound or outbound run-trigger connections between workspaces.
  """
  interface AbstractRunTrigger {
    id: ID!
    workspaceName: String!
    sourceableName: String!
    createdAt: DateTime!
    workspace: Workspace!
    sourceable: Workspace!
  }

  type RunTrigger implements AbstractRunTrigger {
    id: ID!
    workspaceName: String!
    sourceableName: String!
    createdAt: DateTime!
    workspace: Workspace!
    sourceable: Workspace!
  }

  type WorkspaceRunTrigger implements AbstractRunTrigger {
    id: ID!
    workspaceName: String!
    sourceableName: String!
    createdAt: DateTime!
    workspace: Workspace!
    sourceable: Workspace!
    inbound: Boolean! # true if this is an inbound trigger, false if outbound
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
    runTriggers(workspaceId: ID!, filter: RunTriggerFilter): [WorkspaceRunTrigger!]!
    runTrigger(id: ID!): RunTrigger
  }
`;

export default runTriggersSchema;
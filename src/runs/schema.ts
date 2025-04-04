import { gql } from 'graphql-tag';

const runSchema = gql`
  type Run {
    id: ID!
    status: String!
    message: String
    isDestroy: Boolean!
    createdAt: DateTime!
    canceledAt: DateTime
    hasChanges: Boolean!
    autoApply: Boolean!
    allowEmptyApply: Boolean!
    allowConfigGeneration: Boolean!
    planOnly: Boolean!
    source: String!
    statusTimestamps: RunStatusTimestamps
    triggerReason: String!
    targetAddrs: [String!]
    replaceAddrs: [String!]
    permissions: RunPermissions!
    actions: RunActions!
    refresh: Boolean!
    refreshOnly: Boolean!
    savePlan: Boolean!
    variables: [String!]!
    workspace: Workspace
  }

  type RunPermissions {
    canApply: Boolean!
    canCancel: Boolean!
    canComment: Boolean!
    canDiscard: Boolean!
    canForceExecute: Boolean!
    canForceCancel: Boolean!
    canOverridePolicyCheck: Boolean!
  }

  type RunActions {
    isCancelable: Boolean!
    isConfirmable: Boolean!
    isDiscardable: Boolean!
    isForceCancelable: Boolean!
  }

  type RunStatusTimestamps {
    planQueueableAt: DateTime
  }

  extend type Query {
    runs(workspaceId: ID!): [Run!]!
    run(id: ID!): Run
  }

  extend type Mutation {
    createRun(workspaceId: ID!, message: String, isDestroy: Boolean = false, configVersionId: ID): Run!
  }
`;

export default runSchema;
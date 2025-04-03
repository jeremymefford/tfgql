import { gql } from 'graphql-tag';

const runSchema = gql`
  type Run {
    id: ID!
    status: String!
    message: String
    isDestroy: Boolean!
    createdAt: DateTime!
    workspace: Workspace
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
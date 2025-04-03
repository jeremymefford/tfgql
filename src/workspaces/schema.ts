import { gql } from 'graphql-tag';

const workspaceSchema = gql`
  type Workspace {
    id: ID!
    name: String!
    description: String
    locked: Boolean
    autoApply: Boolean
    createdAt: DateTime
    # Parent organization of this workspace
    organization: Organization
    # Runs within this workspace
    runs: [Run!]!
  }

  extend type Query {
    workspaces(orgName: String!): [Workspace!]!
    workspace(id: ID!): Workspace
  }

  extend type Mutation {
    createWorkspace(orgName: String!, name: String!, description: String): Workspace!
  }
`;
export default workspaceSchema;
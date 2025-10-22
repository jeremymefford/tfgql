import { gql } from "graphql-tag";

const workspaceResourcesSchema = gql`
  type WorkspaceResource {
    id: ID!
    address: String!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    module: String!
    provider: String!
    providerType: String!
    modifiedByStateVersion: StateVersion!
    nameIndex: String
    workspace: Workspace!
  }

  input WorkspaceResourceFilter {
    _and: [WorkspaceResourceFilter!]
    _or: [WorkspaceResourceFilter!]
    _not: WorkspaceResourceFilter

    id: StringComparisonExp
    address: StringComparisonExp
    name: StringComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
    module: StringComparisonExp
    provider: StringComparisonExp
    providerType: StringComparisonExp
    nameIndex: IntComparisonExp
  }

  extend type Workspace {
    workspaceResources(filter: WorkspaceResourceFilter): [WorkspaceResource!]!
  }

  extend type Query {
    workspaceResources(
      workspaceId: ID!
      filter: WorkspaceResourceFilter
    ): [WorkspaceResource!]!
  }
`;

export default workspaceResourcesSchema;

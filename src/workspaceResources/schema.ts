import { gql } from "graphql-tag";

const workspaceResourcesSchema = gql`
  """
  A Terraform-managed resource tracked in a workspace's state. Includes the resource address, provider, module path, and the state version that last modified it.
  """
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
    """
    List all Terraform-managed resources tracked in a workspace's state.
    """
    workspaceResources(
      workspaceId: ID!
      filter: WorkspaceResourceFilter
    ): [WorkspaceResource!]!
  }
`;

export default workspaceResourcesSchema;

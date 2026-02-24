import { gql } from "graphql-tag";

const workspaceResourcesSchema = gql`
  """
  A Terraform-managed resource tracked in a workspace's state. Includes the resource address, provider, module path, and the state version that last modified it.
  """
  type WorkspaceResource {
    """The resource's unique identifier."""
    id: ID!
    """The full resource address in Terraform configuration (e.g., 'aws_instance.web')."""
    address: String!
    """The local name of the resource within its module."""
    name: String!
    """Timestamp when the resource was first tracked."""
    createdAt: DateTime!
    """Timestamp of the most recent resource modification."""
    updatedAt: DateTime!
    """The module path containing this resource. 'root' indicates the root module."""
    module: String!
    """The provider namespace and type (e.g., 'hashicorp/aws')."""
    provider: String!
    """The specific resource type from the provider (e.g., 'aws_instance')."""
    providerType: String!
    """The state version that last modified this resource."""
    modifiedByStateVersion: StateVersion!
    """Index suffix for resources declared with for_each or count."""
    nameIndex: String
    """The workspace this resource belongs to."""
    workspace: Workspace!
  }

  """
  Filter conditions for WorkspaceResource queries. Supports logical combinators (_and, _or, _not) and field-level comparisons.
  """
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

import { gql } from "graphql-tag";

const registryProvidersSchema = gql`
  """
  Permission flags for a registry provider.
  """
  type RegistryProviderPermissions {
    """Whether the current user can delete this provider."""
    canDelete: Boolean!
  }

  """
  A provider published to the Terraform private registry. Providers are versioned
  and can include platform-specific binaries for different operating systems and architectures.
  """
  type RegistryProvider {
    """The provider's unique identifier."""
    id: ID!
    """The provider name (e.g. 'aws', 'azurerm')."""
    name: String!
    """The namespace (typically the organization name)."""
    namespace: String!
    """The registry name ('private' or 'public')."""
    registryName: String!
    """Timestamp when the provider was created."""
    createdAt: DateTime!
    """Timestamp when the provider was last updated."""
    updatedAt: DateTime!
    """The name of the owning organization."""
    organizationName: String
    """Permission flags for the current user."""
    permissions: RegistryProviderPermissions!
    """All published versions of this provider."""
    versions(filter: RegistryProviderVersionFilter): [RegistryProviderVersion!]!
  }

  """
  Filter conditions for RegistryProvider queries.
  """
  input RegistryProviderFilter {
    _and: [RegistryProviderFilter!]
    _or: [RegistryProviderFilter!]
    _not: RegistryProviderFilter

    id: StringComparisonExp
    name: StringComparisonExp
    namespace: StringComparisonExp
    registryName: StringComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
  }

`;

export default registryProvidersSchema;

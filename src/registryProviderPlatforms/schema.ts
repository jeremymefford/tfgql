import { gql } from "graphql-tag";

const registryProviderPlatformsSchema = gql`
  """
  Permission flags for a registry provider platform.
  """
  type RegistryProviderPlatformPermissions {
    """Whether the current user can delete this platform."""
    canDelete: Boolean!
    """Whether the current user can upload a binary asset."""
    canUploadAsset: Boolean!
  }

  """
  A platform-specific binary for a registry provider version. Each platform
  represents a specific OS and architecture combination (e.g. linux/amd64).
  """
  type RegistryProviderPlatform {
    """The platform's unique identifier."""
    id: ID!
    """The operating system (e.g. 'linux', 'darwin', 'windows')."""
    os: String!
    """The architecture (e.g. 'amd64', 'arm64')."""
    arch: String!
    """The filename of the provider binary zip."""
    filename: String!
    """The SHA256 checksum of the binary."""
    shasum: String!
    """Whether the provider binary has been uploaded."""
    providerBinaryUploaded: Boolean!
    """Download URL for the provider binary."""
    providerBinaryDownloadUrl: String
    """Permission flags for the current user."""
    permissions: RegistryProviderPlatformPermissions!
    """The parent registry provider version for this platform."""
    registryProviderVersion: RegistryProviderVersion
  }

  """
  Filter conditions for RegistryProviderPlatform queries.
  """
  input RegistryProviderPlatformFilter {
    _and: [RegistryProviderPlatformFilter!]
    _or: [RegistryProviderPlatformFilter!]
    _not: RegistryProviderPlatformFilter

    id: StringComparisonExp
    os: StringComparisonExp
    arch: StringComparisonExp
    filename: StringComparisonExp
    shasum: StringComparisonExp
    providerBinaryUploaded: BooleanComparisonExp
  }

`;

export default registryProviderPlatformsSchema;

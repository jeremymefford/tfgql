import { gql } from "graphql-tag";

const registryProviderVersionsSchema = gql`
  """
  Permission flags for a registry provider version.
  """
  type RegistryProviderVersionPermissions {
    """Whether the current user can delete this version."""
    canDelete: Boolean!
    """Whether the current user can upload assets to this version."""
    canUploadAsset: Boolean!
  }

  """
  A specific version of a registry provider, containing metadata about
  protocols, signing keys, and platform binaries.
  """
  type RegistryProviderVersion {
    """The version's unique identifier."""
    id: ID!
    """The semantic version string (e.g. '3.1.1')."""
    version: String!
    """Timestamp when this version was created."""
    createdAt: DateTime!
    """Timestamp when this version was last updated."""
    updatedAt: DateTime!
    """The GPG key ID used to sign this version's checksums."""
    keyId: String!
    """Supported Terraform provider protocol versions."""
    protocols: [String!]!
    """Whether the SHA256SUMS file has been uploaded."""
    shasumsUploaded: Boolean!
    """Whether the SHA256SUMS.sig file has been uploaded."""
    shasumsSigUploaded: Boolean!
    """Download URL for the SHA256SUMS file."""
    shasumsDownloadUrl: String
    """Download URL for the SHA256SUMS.sig file."""
    shasumsSigDownloadUrl: String
    """Permission flags for the current user."""
    permissions: RegistryProviderVersionPermissions!
    """The parent registry provider for this version."""
    registryProvider: RegistryProvider
    """The GPG key used to sign this version."""
    gpgKey: RegistryGpgKey
    """Platform-specific binaries available for this version."""
    platforms(filter: RegistryProviderPlatformFilter): [RegistryProviderPlatform!]!
  }

  """
  Filter conditions for RegistryProviderVersion queries.
  """
  input RegistryProviderVersionFilter {
    _and: [RegistryProviderVersionFilter!]
    _or: [RegistryProviderVersionFilter!]
    _not: RegistryProviderVersionFilter

    id: StringComparisonExp
    version: StringComparisonExp
    keyId: StringComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
    shasumsUploaded: BooleanComparisonExp
    shasumsSigUploaded: BooleanComparisonExp
  }

`;

export default registryProviderVersionsSchema;

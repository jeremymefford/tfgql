import { gql } from "graphql-tag";

const registryGpgKeysSchema = gql`
  """
  A GPG key used for signing provider packages in the private registry.
  GPG keys are used to verify the integrity and authenticity of provider binaries.
  """
  type RegistryGpgKey {
    """The GPG key's unique identifier."""
    id: ID!
    """The ASCII-armored GPG public key block."""
    asciiArmor: String!
    """Timestamp when the key was registered."""
    createdAt: DateTime!
    """The GPG key fingerprint/ID."""
    keyId: String!
    """The namespace (organization) this key belongs to."""
    namespace: String!
    """The source of the key."""
    source: String!
    """URL of the key source, if applicable."""
    sourceUrl: String
    """The trust signature for this key."""
    trustSignature: String!
    """Timestamp when the key was last updated."""
    updatedAt: DateTime!
  }

  """
  Filter conditions for RegistryGpgKey queries.
  """
  input RegistryGpgKeyFilter {
    _and: [RegistryGpgKeyFilter!]
    _or: [RegistryGpgKeyFilter!]
    _not: RegistryGpgKeyFilter

    id: StringComparisonExp
    keyId: StringComparisonExp
    namespace: StringComparisonExp
    source: StringComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
  }

`;

export default registryGpgKeysSchema;

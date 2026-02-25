import { gql } from "graphql-tag";

const registrySchema = gql`
  """
  A virtual entity representing the private registry for a single organization.
  Provides a unified entry point for modules, providers, and GPG keys.
  """
  type Registry {
    """The organization this registry belongs to (called 'namespace' in the registry API)."""
    organization: Organization
    """Private registry modules for this organization."""
    modules(filter: RegistryModuleFilter): [RegistryModule!]!
    """Private registry providers for this organization."""
    providers(filter: RegistryProviderFilter): [RegistryProvider!]!
    """GPG keys for this organization's private registry."""
    gpgKeys(filter: RegistryGpgKeyFilter): [RegistryGpgKey!]!
  }

  extend type Query {
    """
    List private registries across selected organizations. Each organization
    has one virtual registry that aggregates its modules, providers, and GPG keys.
    """
    registries(
      includeOrgs: [String!]
      excludeOrgs: [String!]
    ): [Registry!]!
  }
`;

export default registrySchema;

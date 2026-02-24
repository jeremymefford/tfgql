import { gql } from "graphql-tag";

const registryModulesSchema = gql`
  """
  A version entry within a registry module, showing the version number and its current status.
  """
  type RegistryModuleVersionStatus {
    """The semantic version string."""
    version: String!
    """The status of this version (e.g. 'ok', 'pending')."""
    status: String!
  }

  """
  VCS repository configuration for a registry module.
  """
  type RegistryModuleVcsRepo {
    """The VCS branch to track."""
    branch: String
    """Whether to recursively clone submodules."""
    ingressSubmodules: Boolean
    """The VCS repository identifier (e.g. 'org/repo')."""
    identifier: String
    """A human-readable display name for the repository."""
    displayIdentifier: String
    """The OAuth token ID used for VCS access."""
    oauthTokenId: String
    """The webhook URL configured for this repository."""
    webhookUrl: String
    """The HTTP URL of the repository."""
    repositoryHttpUrl: String
    """The VCS service provider (e.g. 'github', 'gitlab')."""
    serviceProvider: String
    """Whether to use tags for version detection."""
    tags: Boolean
  }

  """
  Permission flags for a registry module.
  """
  type RegistryModulePermissions {
    """Whether the current user can delete this module."""
    canDelete: Boolean!
    """Whether the current user can resync this module."""
    canResync: Boolean!
    """Whether the current user can retry this module."""
    canRetry: Boolean!
  }

  """
  A provider dependency referenced by a module version or submodule.
  """
  type RegistryModuleProviderDep {
    """The provider name (e.g. 'aws', 'template')."""
    name: String!
    """The version constraint, if any."""
    version: String!
  }

  """
  A submodule within a registry module version.
  """
  type RegistryModuleSubmodule {
    """The relative path to the submodule (e.g. 'modules/consul-cluster')."""
    path: String!
    """Provider dependencies for this submodule."""
    providers: [RegistryModuleProviderDep!]!
    """Module dependencies for this submodule."""
    dependencies: [RegistryModuleProviderDep!]!
  }

  """
  Root module metadata for a registry module version.
  """
  type RegistryModuleRoot {
    """Provider dependencies for the root module."""
    providers: [RegistryModuleProviderDep!]!
    """Module dependencies for the root module."""
    dependencies: [RegistryModuleProviderDep!]!
  }

  """
  A full version of a registry module, including submodule and root module details.
  Retrieved from the registry v1 API.
  """
  type RegistryModuleVersionDetail {
    """The semantic version string."""
    version: String!
    """Submodules included in this version."""
    submodules: [RegistryModuleSubmodule!]!
    """Root module metadata."""
    root: RegistryModuleRoot
  }

  """
  Filter conditions for RegistryModuleVersionDetail queries.
  """
  input RegistryModuleVersionDetailFilter {
    _and: [RegistryModuleVersionDetailFilter!]
    _or: [RegistryModuleVersionDetailFilter!]
    _not: RegistryModuleVersionDetailFilter

    version: StringComparisonExp
  }

  """
  A module published to the Terraform private registry. Modules can be sourced from VCS
  repositories or uploaded directly, and are versioned independently.
  """
  type RegistryModule {
    """The module's unique identifier."""
    id: ID!
    """The module name."""
    name: String!
    """The namespace (typically the organization name)."""
    namespace: String!
    """The provider this module is associated with (e.g. 'aws', 'azurerm')."""
    provider: String!
    """The registry name ('private' or 'public')."""
    registryName: String!
    """The current status of the module."""
    status: String!
    """Version statuses for all published versions of this module."""
    versionStatuses: [RegistryModuleVersionStatus!]!
    """Timestamp when the module was created."""
    createdAt: DateTime!
    """Timestamp when the module was last updated."""
    updatedAt: DateTime!
    """How the module is published (e.g. 'branch', 'tag')."""
    publishingMechanism: String
    """Whether this is a no-code module."""
    noCode: Boolean
    """The name of the owning organization."""
    organizationName: String
    """Permission flags for the current user."""
    permissions: RegistryModulePermissions!
    """VCS repository configuration, if applicable."""
    vcsRepo: RegistryModuleVcsRepo
    """Full version details including submodules and root module info. Fetched from the registry v1 API."""
    versions(filter: RegistryModuleVersionDetailFilter): [RegistryModuleVersionDetail!]!
    """Test runs for this module."""
    testRuns(filter: RegistryTestRunFilter): [RegistryTestRun!]!
    """Test variables configured for this module."""
    testVariables(filter: RegistryTestVariableFilter): [RegistryTestVariable!]!
  }

  """
  Filter conditions for RegistryModule queries.
  """
  input RegistryModuleFilter {
    _and: [RegistryModuleFilter!]
    _or: [RegistryModuleFilter!]
    _not: RegistryModuleFilter

    id: StringComparisonExp
    name: StringComparisonExp
    namespace: StringComparisonExp
    provider: StringComparisonExp
    registryName: StringComparisonExp
    status: StringComparisonExp
    createdAt: DateTimeComparisonExp
    updatedAt: DateTimeComparisonExp
  }
`;

export default registryModulesSchema;

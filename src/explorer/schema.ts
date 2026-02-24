import { gql } from "graphql-tag";

const explorerSchema = gql`
  """
  Comparison operators available for Explorer API server-side filters.
  """
  enum ExplorerFilterOperator {
    is
    is_not
    contains
    does_not_contain
    is_empty
    is_not_empty
    gt
    lt
    gteq
    lteq
    is_before
    is_after
  }

  """
  Available fields for filtering and sorting in Explorer workspace queries.
  """
  enum ExplorerWorkspaceField {
    all_checks_succeeded
    current_rum_count
    checks_errored
    checks_failed
    checks_passed
    checks_unknown
    current_run_applied_at
    current_run_external_id
    current_run_status
    drifted
    external_id
    module_count
    modules
    organization_name
    project_external_id
    project_name
    provider_count
    providers
    resources_drifted
    resources_undrifted
    state_version_terraform_version
    tags
    vcs_repo_identifier
    workspace_created_at
    workspace_name
    workspace_terraform_version
    workspace_updated_at
  }

  """
  Available fields for filtering and sorting in Explorer Terraform version queries.
  """
  enum ExplorerTerraformVersionField {
    version
    workspace_count
    workspaces
  }

  """
  Available fields for filtering and sorting in Explorer provider queries.
  """
  enum ExplorerProviderField {
    name
    source
    version
    workspace_count
    workspaces
  }

  """
  Available fields for filtering and sorting in Explorer module queries.
  """
  enum ExplorerModuleField {
    name
    source
    version
    workspace_count
    workspaces
  }

  """
  A server-side filter condition for Explorer workspace queries, specifying a field, operator, and value.
  """
  input ExplorerWorkspaceFilterInput {
    field: ExplorerWorkspaceField!
    operator: ExplorerFilterOperator!
    value: String!
  }

  """
  A server-side filter condition for Explorer Terraform version queries.
  """
  input ExplorerTerraformVersionFilterInput {
    field: ExplorerTerraformVersionField!
    operator: ExplorerFilterOperator!
    value: String!
  }

  """
  A server-side filter condition for Explorer provider queries.
  """
  input ExplorerProviderFilterInput {
    field: ExplorerProviderField!
    operator: ExplorerFilterOperator!
    value: String!
  }

  """
  A server-side filter condition for Explorer module queries.
  """
  input ExplorerModuleFilterInput {
    field: ExplorerModuleField!
    operator: ExplorerFilterOperator!
    value: String!
  }

  """
  Sort configuration for Explorer Terraform version queries.
  """
  input ExplorerTerraformVersionSortInput {
    field: ExplorerTerraformVersionField!
    ascending: Boolean!
  }
  """
  Sort configuration for Explorer provider queries.
  """
  input ExplorerProviderSortInput {
    field: ExplorerProviderField!
    ascending: Boolean!
  }
  """
  Sort configuration for Explorer module queries.
  """
  input ExplorerModuleSortInput {
    field: ExplorerModuleField!
    ascending: Boolean!
  }
  """
  Sort configuration for Explorer workspace queries.
  """
  input ExplorerWorkspaceSortInput {
    field: ExplorerWorkspaceField!
    ascending: Boolean!
  }

  """
  A denormalized row from the HCP Terraform Explorer API representing a workspace with inline metadata about its current run, drift status, checks, providers, and modules.
  """
  type ExplorerWorkspaceRow @tfcOnly {
    """True if all health checks have succeeded for the workspace."""
    allChecksSucceeded: Boolean
    """Count of managed resources (Resources Under Management) in the workspace."""
    currentRumCount: Int
    """Number of health checks that errored without completing."""
    checksErrored: Int
    """Number of health checks that completed but did not pass."""
    checksFailed: Int
    """Number of health checks that passed."""
    checksPassed: Int
    """Number of health checks that could not be assessed."""
    checksUnknown: Int
    """Timestamp when the workspace's current run was applied."""
    currentRunAppliedAt: DateTime
    """The external identifier of the workspace's current run."""
    currentRunExternalId: String
    """The execution status of the workspace's current run."""
    currentRunStatus: String
    """True if infrastructure drift has been detected for the workspace."""
    drifted: Boolean
    """The workspace's external identifier."""
    externalId: String
    """Number of distinct Terraform modules used in the workspace."""
    moduleCount: Int
    """Comma-separated list of modules used by this workspace."""
    modules: String
    """The name of the workspace's parent organization."""
    organizationName: String
    """The external identifier of the workspace's project."""
    projectExternalId: String
    """The display name of the workspace's project."""
    projectName: String
    """Number of distinct Terraform providers used in the workspace."""
    providerCount: Int
    """Comma-separated list of providers used in this workspace."""
    providers: String
    """Number of resources with detected drift."""
    resourcesDrifted: Int
    """Number of resources without drift."""
    resourcesUndrifted: Int
    """The Terraform version used to create the current state."""
    stateVersionTerraformVersion: String
    """Comma-separated list of tags applied to the workspace."""
    tags: String
    """The VCS repository identifier, if the workspace is VCS-connected."""
    vcsRepoIdentifier: String
    """Timestamp when the workspace was created."""
    workspaceCreatedAt: DateTime
    """The workspace's display name."""
    workspaceName: String
    """The Terraform version configured for the workspace."""
    workspaceTerraformVersion: String
    """Timestamp when the workspace was last modified."""
    workspaceUpdatedAt: DateTime
    """The resolved Workspace entity for this row."""
    workspace: Workspace
    """The resolved Project entity for this row."""
    project: Project
    """The resolved Run entity for the current run."""
    currentRun: Run
    """The resolved Organization entity for this row."""
    organization: Organization
  }

  """
  A row from the Explorer API grouping workspaces by Terraform version.
  """
  type ExplorerTerraformVersionRow @tfcOnly {
    """The semantic version string for this Terraform version."""
    version: String
    """Number of workspaces using this Terraform version."""
    workspaceCount: Int
    """Comma-separated list of workspace names using this version."""
    workspaces: String
    """The resolved Organization entity."""
    organization: Organization
    """Resolved Workspace entities using this Terraform version, with optional filtering."""
    workspaceEntities(filter: WorkspaceFilter): [Workspace!]!
  }

  """
  A row from the Explorer API grouping workspaces by Terraform provider.
  """
  type ExplorerProviderRow @tfcOnly {
    """The provider's display name."""
    name: String
    """The provider's source address."""
    source: String
    """The semantic version string for this provider."""
    version: String
    """Number of workspaces using this provider."""
    workspaceCount: Int
    """Comma-separated list of workspace names using this provider."""
    workspaces: String
    """The resolved Organization entity."""
    organization: Organization
    """Resolved Workspace entities using this provider, with optional filtering."""
    workspaceEntities(filter: WorkspaceFilter): [Workspace!]!
  }

  """
  A row from the Explorer API grouping workspaces by Terraform module.
  """
  type ExplorerModuleRow @tfcOnly {
    """The module's display name."""
    name: String
    """The module's source location."""
    source: String
    """The semantic version string for this module."""
    version: String
    """Number of workspaces using this module version."""
    workspaceCount: Int
    """Comma-separated list of workspace names using this module version."""
    workspaces: String
    """The resolved Organization entity."""
    organization: Organization
    """Resolved Workspace entities using this module, with optional filtering."""
    workspaceEntities(filter: WorkspaceFilter): [Workspace!]!
  }

  extend type Query {
    """
    Query the HCP Terraform Explorer API for workspace data with server-side filtering and sorting. Only available on HCP Terraform (not Terraform Enterprise).
    """
    explorerWorkspaces(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      sort: [ExplorerWorkspaceSortInput!]
      filters: [ExplorerWorkspaceFilterInput!]
    ): [ExplorerWorkspaceRow!]! @tfcOnly

    """
    Query the Explorer API for Terraform version usage across workspaces.
    """
    explorerTerraformVersions(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      sort: [ExplorerTerraformVersionSortInput!]
      filters: [ExplorerTerraformVersionFilterInput!]
    ): [ExplorerTerraformVersionRow!]! @tfcOnly

    """
    Query the Explorer API for provider usage across workspaces.
    """
    explorerProviders(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      sort: [ExplorerProviderSortInput!]
      filters: [ExplorerProviderFilterInput!]
    ): [ExplorerProviderRow!]! @tfcOnly

    """
    Query the Explorer API for module usage across workspaces.
    """
    explorerModules(
      includeOrgs: [String!]
      excludeOrgs: [String!]
      sort: [ExplorerModuleSortInput!]
      filters: [ExplorerModuleFilterInput!]
    ): [ExplorerModuleRow!]! @tfcOnly
  }
`;

export default explorerSchema;

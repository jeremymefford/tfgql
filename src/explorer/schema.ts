import { gql } from "graphql-tag";

const explorerSchema = gql`
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

  enum ExplorerTerraformVersionField {
    version
    workspace_count
    workspaces
  }

  enum ExplorerProviderField {
    name
    source
    version
    workspace_count
    workspaces
  }

  enum ExplorerModuleField {
    name
    source
    version
    workspace_count
    workspaces
  }

  input ExplorerWorkspaceFilterInput {
    field: ExplorerWorkspaceField!
    operator: ExplorerFilterOperator!
    value: String!
  }

  input ExplorerTerraformVersionFilterInput {
    field: ExplorerTerraformVersionField!
    operator: ExplorerFilterOperator!
    value: String!
  }

  input ExplorerProviderFilterInput {
    field: ExplorerProviderField!
    operator: ExplorerFilterOperator!
    value: String!
  }

  input ExplorerModuleFilterInput {
    field: ExplorerModuleField!
    operator: ExplorerFilterOperator!
    value: String!
  }

  input ExplorerTerraformVersionSortInput {
    field: ExplorerTerraformVersionField!
    ascending: Boolean!
  }
  input ExplorerProviderSortInput {
    field: ExplorerProviderField!
    ascending: Boolean!
  }
  input ExplorerModuleSortInput {
    field: ExplorerModuleField!
    ascending: Boolean!
  }
  input ExplorerWorkspaceSortInput {
    field: ExplorerWorkspaceField!
    ascending: Boolean!
  }

  """
  A denormalized row from the HCP Terraform Explorer API representing a workspace with inline metadata about its current run, drift status, checks, providers, and modules.
  """
  type ExplorerWorkspaceRow @tfcOnly {
    allChecksSucceeded: Boolean
    currentRumCount: Int
    checksErrored: Int
    checksFailed: Int
    checksPassed: Int
    checksUnknown: Int
    currentRunAppliedAt: DateTime
    currentRunExternalId: String
    currentRunStatus: String
    drifted: Boolean
    externalId: String
    moduleCount: Int
    modules: String
    organizationName: String
    projectExternalId: String
    projectName: String
    providerCount: Int
    providers: String
    resourcesDrifted: Int
    resourcesUndrifted: Int
    stateVersionTerraformVersion: String
    tags: String
    vcsRepoIdentifier: String
    workspaceCreatedAt: DateTime
    workspaceName: String
    workspaceTerraformVersion: String
    workspaceUpdatedAt: DateTime
    workspace: Workspace
    project: Project
    currentRun: Run
    organization: Organization
  }

  """
  A row from the Explorer API grouping workspaces by Terraform version.
  """
  type ExplorerTerraformVersionRow @tfcOnly {
    version: String
    workspaceCount: Int
    workspaces: String
    organization: Organization
    workspaceEntities(filter: WorkspaceFilter): [Workspace!]!
  }

  """
  A row from the Explorer API grouping workspaces by Terraform provider.
  """
  type ExplorerProviderRow @tfcOnly {
    name: String
    source: String
    version: String
    workspaceCount: Int
    workspaces: String
    organization: Organization
    workspaceEntities(filter: WorkspaceFilter): [Workspace!]!
  }

  """
  A row from the Explorer API grouping workspaces by Terraform module.
  """
  type ExplorerModuleRow @tfcOnly {
    name: String
    source: String
    version: String
    workspaceCount: Int
    workspaces: String
    organization: Organization
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

import type { ResourceObject, ListResponse } from "../common/types/jsonApi";

export type ExplorerViewType =
  | "workspaces"
  | "tf_versions"
  | "providers"
  | "modules";

export type ExplorerFilterOperator =
  | "is"
  | "is_not"
  | "contains"
  | "does_not_contain"
  | "is_empty"
  | "is_not_empty"
  | "gt"
  | "lt"
  | "gteq"
  | "lteq"
  | "is_before"
  | "is_after";

export type ExplorerWorkspaceField =
  | "all_checks_succeeded"
  | "current_rum_count"
  | "checks_errored"
  | "checks_failed"
  | "checks_passed"
  | "checks_unknown"
  | "current_run_applied_at"
  | "current_run_external_id"
  | "current_run_status"
  | "drifted"
  | "external_id"
  | "module_count"
  | "modules"
  | "organization_name"
  | "project_external_id"
  | "project_name"
  | "provider_count"
  | "providers"
  | "resources_drifted"
  | "resources_undrifted"
  | "state_version_terraform_version"
  | "tags"
  | "vcs_repo_identifier"
  | "workspace_created_at"
  | "workspace_name"
  | "workspace_terraform_version"
  | "workspace_updated_at";

export type ExplorerTerraformVersionField =
  | "version"
  | "workspace_count"
  | "workspaces";
export type ExplorerProviderField =
  | "name"
  | "source"
  | "version"
  | "workspace_count"
  | "workspaces";
export type ExplorerModuleField =
  | "name"
  | "source"
  | "version"
  | "workspace_count"
  | "workspaces";

export interface ExplorerFilter<Field extends string> {
  field: Field;
  operator: ExplorerFilterOperator;
  value: string;
}

export interface ExplorerSort<Field extends string> {
  field: Field;
  ascending: boolean;
}

export interface ExplorerFilterInput<Field extends string> {
  field: Field;
  operator: ExplorerFilterOperator;
  value: string;
}

export interface ExplorerSortInput<Field extends string> {
  field: Field;
  ascending: boolean;
}

export interface ExplorerQueryOptions<Field extends string> {
  sort?: ExplorerSort<Field>[];
  filters?: ExplorerFilter<Field>[];
}

export interface ExplorerWorkspaceAttributes {
  "all-checks-succeeded"?: boolean;
  current_rum_count?: number;
  "checks-errored"?: number;
  "checks-failed"?: number;
  "checks-passed"?: number;
  "checks-unknown"?: number;
  "current-run-applied-at"?: string | null;
  "current-run-external-id"?: string | null;
  "current-run-status"?: string | null;
  drifted?: boolean;
  "external-id"?: string;
  "module-count"?: number;
  modules?: string | null;
  "organization-name"?: string;
  "project-external-id"?: string | null;
  "project-name"?: string | null;
  "provider-count"?: number;
  providers?: string | null;
  "resources-drifted"?: number;
  "resources-undrifted"?: number;
  "state-version-terraform-version"?: string | null;
  tags?: string | null;
  "vcs-repo-identifier"?: string | null;
  "workspace-created-at"?: string;
  "workspace-name"?: string;
  "workspace-terraform-version"?: string;
  "workspace-updated-at"?: string;
}

export interface ExplorerTerraformVersionAttributes {
  version?: string;
  "workspace-count"?: number;
  workspaces?: string | null;
}

export interface ExplorerProviderAttributes {
  name?: string;
  source?: string;
  version?: string;
  "workspace-count"?: number;
  workspaces?: string | null;
}

export interface ExplorerModuleAttributes {
  name?: string;
  source?: string;
  version?: string;
  "workspace-count"?: number;
  workspaces?: string | null;
}

export type ExplorerWorkspaceResource =
  ResourceObject<ExplorerWorkspaceAttributes>;
export type ExplorerWorkspaceListResponse =
  ListResponse<ExplorerWorkspaceResource>;

export type ExplorerTerraformVersionResource =
  ResourceObject<ExplorerTerraformVersionAttributes>;
export type ExplorerTerraformVersionListResponse =
  ListResponse<ExplorerTerraformVersionResource>;

export type ExplorerProviderResource =
  ResourceObject<ExplorerProviderAttributes>;
export type ExplorerProviderListResponse =
  ListResponse<ExplorerProviderResource>;

export type ExplorerModuleResource = ResourceObject<ExplorerModuleAttributes>;
export type ExplorerModuleListResponse = ListResponse<ExplorerModuleResource>;

export interface ExplorerRowBase {
  __organizationName?: string;
}

export interface ExplorerWorkspaceRow extends ExplorerRowBase {
  allChecksSucceeded: boolean | null;
  currentRumCount: number | null;
  checksErrored: number | null;
  checksFailed: number | null;
  checksPassed: number | null;
  checksUnknown: number | null;
  currentRunAppliedAt: Date | null;
  currentRunExternalId: string | null;
  currentRunStatus: string | null;
  drifted: boolean | null;
  externalId: string | null;
  moduleCount: number | null;
  modules: string | null;
  organizationName: string | null;
  projectExternalId: string | null;
  projectName: string | null;
  providerCount: number | null;
  providers: string | null;
  resourcesDrifted: number | null;
  resourcesUndrifted: number | null;
  stateVersionTerraformVersion: string | null;
  tags: string | null;
  vcsRepoIdentifier: string | null;
  workspaceCreatedAt: Date | null;
  workspaceName: string | null;
  workspaceTerraformVersion: string | null;
  workspaceUpdatedAt: Date | null;
}

export interface ExplorerTerraformVersionRow extends ExplorerRowBase {
  version: string | null;
  workspaceCount: number | null;
  workspaces: string | null;
}

export interface ExplorerProviderRow extends ExplorerRowBase {
  name: string | null;
  source: string | null;
  version: string | null;
  workspaceCount: number | null;
  workspaces: string | null;
}

export interface ExplorerModuleRow extends ExplorerRowBase {
  name: string | null;
  source: string | null;
  version: string | null;
  workspaceCount: number | null;
  workspaces: string | null;
}

export interface ExplorerWorkspaceResult {
  data: ExplorerWorkspaceRow[];
}

export interface ExplorerTerraformVersionResult {
  data: ExplorerTerraformVersionRow[];
}

export interface ExplorerProviderResult {
  data: ExplorerProviderRow[];
}

export interface ExplorerModuleResult {
  data: ExplorerModuleRow[];
}

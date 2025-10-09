import { BooleanComparisonExp, DateTimeComparisonExp, IntComparisonExp, StringComparisonExp, WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface WorkspaceAttributes {
  name: string;
  description?: string;
  locked: boolean;
  'locked-reason'?: string;
  'auto-apply': boolean;
  'created-at': string;
  'updated-at': string;
  'apply-duration-average'?: number;
  'plan-duration-average'?: number;
  'policy-check-failures'?: number;
  'queue-all-runs'?: boolean;
  'resource-count'?: number;
  'run-failures'?: number;
  source?: string;
  'source-name'?: string;
  'source-url'?: string;
  'speculative-enabled': boolean;
  'structured-run-output-enabled': boolean;
  'tag-names': string[];
  'terraform-version': string;
  'trigger-prefixes': string[];
  'vcs-repo'?: any;
  'vcs-repo-identifier'?: string;
  'working-directory'?: string;
  'workspace-kpis-runs-count'?: number;
  'execution-mode': string;
  environment?: string;
  operations: boolean;
  'file-triggers-enabled': boolean;
  'global-remote-state': boolean;
  'latest-change-at'?: string;
  'last-assessment-result-at'?: string;
  'auto-destroy-at'?: string;
  'auto-destroy-status'?: string;
  'auto-destroy-activity-duration'?: number;
  'inherits-project-auto-destroy'?: boolean;
  'assessments-enabled': boolean;
  'allow-destroy-plan': boolean;
  'auto-apply-run-trigger': boolean;
  'oauth-client-name'?: string;
  actions: WorkspaceActions;
  permissions: WorkspacePermissions;
  'setting-overwrites': WorkspaceSettingOverwrites;
}

export interface WorkspaceActions {
  'is-destroyable': boolean;
}

export interface WorkspacePermissions {
  'can-update': boolean;
  'can-destroy': boolean;
  'can-queue-run': boolean;
  'can-read-run': boolean;
  'can-read-variable': boolean;
  'can-update-variable': boolean;
  'can-read-state-versions': boolean;
  'can-read-state-outputs': boolean;
  'can-create-state-versions': boolean;
  'can-queue-apply': boolean;
  'can-lock': boolean;
  'can-unlock': boolean;
  'can-force-unlock': boolean;
  'can-read-settings': boolean;
  'can-manage-tags': boolean;
  'can-manage-run-tasks': boolean;
  'can-force-delete': boolean;
  'can-manage-assessments': boolean;
  'can-manage-ephemeral-workspaces': boolean;
  'can-read-assessment-results': boolean;
  'can-queue-destroy': boolean;
}

export interface WorkspaceSettingOverwrites {
  'execution-mode'?: boolean;
  'agent-pool'?: boolean;
}

export interface WorkspaceRelationships {
  organization?: {
    data: ResourceRef;
  };
}

export type WorkspaceResource = ResourceObject<WorkspaceAttributes> & { relationships?: WorkspaceRelationships };
export type WorkspaceListResponse = ListResponse<WorkspaceResource>;
export type WorkspaceResponse = SingleResponse<WorkspaceResource>;

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  locked: boolean;
  lockedReason?: string;
  autoApply: boolean;
  createdAt: Date;
  updatedAt: Date;
  applyDurationAverage?: number;
  planDurationAverage?: number;
  policyCheckFailures?: number;
  queueAllRuns?: boolean;
  resourceCount?: number;
  runFailures?: number;
  source?: string;
  sourceName?: string;
  sourceUrl?: string;
  speculativeEnabled: boolean;
  structuredRunOutputEnabled: boolean;
  tagNames: string[];
  terraformVersion: string;
  triggerPrefixes: string[];
  vcsRepo?: any;
  vcsRepoIdentifier?: string;
  workingDirectory?: string;
  workspaceKpisRunsCount?: number;
  executionMode: string;
  environment?: string;
  operations: boolean;
  fileTriggersEnabled: boolean;
  globalRemoteState: boolean;
  latestChangeAt?: string;
  lastAssessmentResultAt?: string;
  autoDestroyAt?: string;
  autoDestroyStatus?: string;
  autoDestroyActivityDuration?: number;
  inheritsProjectAutoDestroy?: boolean;
  assessmentsEnabled: boolean;
  allowDestroyPlan: boolean;
  autoApplyRunTrigger: boolean;
  oauthClientName?: string;
  actions: {
    isDestroyable: boolean;
  };
  permissions: {
    canUpdate: boolean;
    canDestroy: boolean;
    canQueueRun: boolean;
    canReadRun: boolean;
    canReadVariable: boolean;
    canUpdateVariable: boolean;
    canReadStateVersions: boolean;
    canReadStateOutputs: boolean;
    canCreateStateVersions: boolean;
    canQueueApply: boolean;
    canLock: boolean;
    canUnlock: boolean;
    canForceUnlock: boolean;
    canReadSettings: boolean;
    canManageTags: boolean;
    canManageRunTasks: boolean;
    canForceDelete: boolean;
    canManageAssessments: boolean;
    canManageEphemeralWorkspaces: boolean;
    canReadAssessmentResults: boolean;
    canQueueDestroy: boolean;
  };
  settingOverwrites: {
    executionMode?: boolean;
    agentPool?: boolean;
  };
  organizationName?: string;
}

export interface WorkspaceProvider {
  name: string | null;
  version: string | null;
  source: string | null;
}

export interface WorkspaceModule {
  name: string | null;
  version: string | null;
  source: string | null;
}

export interface WorkspaceSettingOverwritesFilter extends WhereClause<Workspace['settingOverwrites']> {
  _and?: WorkspaceSettingOverwritesFilter[];
  _or?: WorkspaceSettingOverwritesFilter[];
  _not?: WorkspaceSettingOverwritesFilter;

  executionMode?: BooleanComparisonExp;
  agentPool?: BooleanComparisonExp;
}

export interface WorkspaceActionsFilter extends WhereClause<Workspace['actions']> {
  isDestroyable?: BooleanComparisonExp;
}

export interface WorkspacePermissionsFilter extends WhereClause<Workspace['permissions']> {
  _and?: WorkspacePermissionsFilter[];
  _or?: WorkspacePermissionsFilter[];
  _not?: WorkspacePermissionsFilter;

  canUpdate?: BooleanComparisonExp;
  canDestroy?: BooleanComparisonExp;
  canQueueRun?: BooleanComparisonExp;
  canReadRun?: BooleanComparisonExp;
  canReadVariable?: BooleanComparisonExp;
  canUpdateVariable?: BooleanComparisonExp;
  canReadStateVersions?: BooleanComparisonExp;
  canReadStateOutputs?: BooleanComparisonExp;
  canCreateStateVersions?: BooleanComparisonExp;
  canQueueApply?: BooleanComparisonExp;
  canLock?: BooleanComparisonExp;
  canUnlock?: BooleanComparisonExp;
  canForceUnlock?: BooleanComparisonExp;
  canReadSettings?: BooleanComparisonExp;
  canManageTags?: BooleanComparisonExp;
  canManageRunTasks?: BooleanComparisonExp;
  canForceDelete?: BooleanComparisonExp;
  canManageAssessments?: BooleanComparisonExp;
  canManageEphemeralWorkspaces?: BooleanComparisonExp;
  canReadAssessmentResults?: BooleanComparisonExp;
  canQueueDestroy?: BooleanComparisonExp;
}

export interface WorkspaceFilter extends WhereClause<
  Workspace, {
    actions: WorkspaceActionsFilter;
    permissions: WorkspacePermissionsFilter;
    settingOverwrites: WorkspaceSettingOverwritesFilter;
  }> {
  _and?: WorkspaceFilter[];
  _or?: WorkspaceFilter[];
  _not?: WorkspaceFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  description?: StringComparisonExp;
  locked?: BooleanComparisonExp;
  lockedReason?: StringComparisonExp;
  autoApply?: BooleanComparisonExp;
  createdAt?: DateTimeComparisonExp;
  updatedAt?: DateTimeComparisonExp;
  applyDurationAverage?: IntComparisonExp;
  planDurationAverage?: IntComparisonExp;
  policyCheckFailures?: IntComparisonExp;
  queueAllRuns?: BooleanComparisonExp;
  resourceCount?: IntComparisonExp;
  runFailures?: IntComparisonExp;
  source?: StringComparisonExp;
  sourceName?: StringComparisonExp;
  sourceUrl?: StringComparisonExp;
  speculativeEnabled?: BooleanComparisonExp;
  structuredRunOutputEnabled?: BooleanComparisonExp;
  tagNames?: StringComparisonExp;
  terraformVersion?: StringComparisonExp;
  triggerPrefixes?: StringComparisonExp;
  vcsRepoIdentifier?: StringComparisonExp;
  workingDirectory?: StringComparisonExp;
  workspaceKpisRunsCount?: IntComparisonExp;
  executionMode?: StringComparisonExp;
  environment?: StringComparisonExp;
  operations?: BooleanComparisonExp;
  fileTriggersEnabled?: BooleanComparisonExp;
  globalRemoteState?: BooleanComparisonExp;
  latestChangeAt?: DateTimeComparisonExp;
  lastAssessmentResultAt?: DateTimeComparisonExp;
  autoDestroyAt?: DateTimeComparisonExp;
  autoDestroyStatus?: StringComparisonExp;
  autoDestroyActivityDuration?: IntComparisonExp;
  inheritsProjectAutoDestroy?: BooleanComparisonExp;
  assessmentsEnabled?: BooleanComparisonExp;
  allowDestroyPlan?: BooleanComparisonExp;
  autoApplyRunTrigger?: BooleanComparisonExp;
  oauthClientName?: StringComparisonExp;
  actions?: WorkspaceActionsFilter;
  permissions?: WorkspacePermissionsFilter;
  settingOverwrites?: WorkspaceSettingOverwritesFilter;
}

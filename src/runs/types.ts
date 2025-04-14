import { BooleanComparisonExp, DateTimeComparisonExp, StringComparisonExp, WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';


export interface RunAttributes {
  status: string;
  'created-at': string;
  'canceled-at': string | null;
  'is-destroy': boolean;
  message?: string;
  'has-changes': boolean;
  'auto-apply': boolean;
  'allow-empty-apply': boolean;
  'allow-config-generation': boolean;
  'plan-only': boolean;
  source: string;
  'status-timestamps': {
    'plan-queueable-at'?: string;
  };
  'trigger-reason': string;
  'target-addrs': string[] | null;
  'replace-addrs': string[] | null;
  permissions: {
    'can-apply': boolean;
    'can-cancel': boolean;
    'can-comment': boolean;
    'can-discard': boolean;
    'can-force-execute': boolean;
    'can-force-cancel': boolean;
    'can-override-policy-check': boolean;
  };
  refresh: boolean;
  'refresh-only': boolean;
  'save-plan': boolean;
  variables: string[];
  actions: {
    'is-cancelable': boolean;
    'is-confirmable': boolean;
    'is-discardable': boolean;
    'is-force-cancelable': boolean;
  };
  relationships?: {
    workspace?: {
      data?: {
        id: string;
        type: string;
      };
    };
    apply?: {
      data?: {
        id: string;
        type: string;
      };
    };
    'configuration-version'?: {
      data?: {
        id: string;
        type: string;
      };
    };
    'confirmed-by'?: {
      data?: {
        id: string;
        type: string;
      };
    };
    plan?: {
      data?: {
        id: string;
        type: string;
      };
    };
    'run-events'?: {
      data?: {
        id: string;
        type: string;
      }[];
    };
    'task-stages'?: {
      data?: {
        id: string;
        type: string;
      }[];
    };
    'policy-checks'?: {
      data?: {
        id: string;
        type: string;
      }[];
    };
    comments?: {
      data?: {
        id: string;
        type: string;
      }[];
    };
  };
}

export type RunResource = ResourceObject<RunAttributes>;
export type RunListResponse = ListResponse<RunResource>;
export type RunResponse = SingleResponse<RunResource>;

/** Domain model for Run (matches GraphQL type fields) */
export interface Run {
  id: string;
  status: string;
  message?: string;
  isDestroy: boolean;
  createdAt: string;
  canceledAt: string;
  hasChanges: boolean;
  autoApply: boolean;
  allowEmptyApply: boolean;
  allowConfigGeneration: boolean;
  planOnly: boolean;
  source: string;
  statusTimestamps: {
    planQueueableAt?: string;
  };
  triggerReason: string;
  targetAddrs: string[] | null;
  replaceAddrs: string[] | null;
  permissions: {
    canApply: boolean;
    canCancel: boolean;
    canComment: boolean;
    canDiscard: boolean;
    canForceExecute: boolean;
    canForceCancel: boolean;
    canOverridePolicyCheck: boolean;
  };
  refresh: boolean;
  refreshOnly: boolean;
  savePlan: boolean;
  variables: string[];
  actions: {
    isCancelable: boolean;
    isConfirmable: boolean;
    isDiscardable: boolean;
    isForceCancelable: boolean;
  };
  workspace?: ResourceRef;
  configurationVersion?: ResourceRef;
}

export interface RunPermissionsFilter extends WhereClause<Run['permissions']> {
  _and?: RunPermissionsFilter[];
  _or?: RunPermissionsFilter[];
  _not?: RunPermissionsFilter;

  canApply?: BooleanComparisonExp;
  canCancel?: BooleanComparisonExp;
  canComment?: BooleanComparisonExp;
  canDiscard?: BooleanComparisonExp;
  canForceExecute?: BooleanComparisonExp;
  canForceCancel?: BooleanComparisonExp;
  canOverridePolicyCheck?: BooleanComparisonExp;
}

export interface RunActionsFilter extends WhereClause<Run['actions']> {
  _and?: RunActionsFilter[];
  _or?: RunActionsFilter[];
  _not?: RunActionsFilter;

  isCancelable?: BooleanComparisonExp;
  isConfirmable?: BooleanComparisonExp;
  isDiscardable?: BooleanComparisonExp;
  isForceCancelable?: BooleanComparisonExp;
}

export interface RunStatusTimestampsFilter extends WhereClause<Run['statusTimestamps']> {
  planQueueableAt?: DateTimeComparisonExp;
}

export interface RunFilter extends WhereClause<
  Run, {
    permissions: RunPermissionsFilter;
    actions: RunActionsFilter;
    statusTimestamps: RunStatusTimestampsFilter;
  }> {
  _and?: RunFilter[];
  _or?: RunFilter[];
  _not?: RunFilter;

  id?: StringComparisonExp;
  status?: StringComparisonExp;
  message?: StringComparisonExp;
  source?: StringComparisonExp;
  triggerReason?: StringComparisonExp;

  isDestroy?: BooleanComparisonExp;
  hasChanges?: BooleanComparisonExp;
  autoApply?: BooleanComparisonExp;
  allowEmptyApply?: BooleanComparisonExp;
  allowConfigGeneration?: BooleanComparisonExp;
  planOnly?: BooleanComparisonExp;
  refresh?: BooleanComparisonExp;
  refreshOnly?: BooleanComparisonExp;
  savePlan?: BooleanComparisonExp;
  createdAt?: DateTimeComparisonExp;
  canceledAt?: DateTimeComparisonExp;

  permissions?: RunPermissionsFilter;
  actions?: RunActionsFilter;
  statusTimestamps?: RunStatusTimestampsFilter;
}
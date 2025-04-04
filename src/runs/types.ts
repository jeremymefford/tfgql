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
}

export type RunResource = ResourceObject<RunAttributes> & { relationships?: RunRelationships };
export type RunListResponse = ListResponse<RunResource>;
export type RunResponse = SingleResponse<RunResource>;

/** Domain model for Run (matches GraphQL type fields) */
export interface Run {
  id: string;
  status: string;
  message?: string;
  isDestroy: boolean;
  createdAt: string;
  canceledAt: string | null;
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
  workspaceId?: string;
}
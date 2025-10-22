import { StringComparisonExp, WhereClause } from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef,
} from "../common/types/jsonApi";

export interface PolicyCheckAttributes {
  status: string;
  scope: string;
  result: unknown;
  "status-timestamps"?: Record<string, string | undefined>;
  permissions?: {
    "can-override"?: boolean;
  };
  actions?: {
    "is-overridable"?: boolean;
  };
  "created-at": string;
  "finished-at"?: string | null;
  "policy-evaluation-id"?: string;
  "task-stage-id"?: string;
}

export interface PolicyCheckRelationships {
  run?: { data?: ResourceRef };
}

export type PolicyCheckResource = ResourceObject<PolicyCheckAttributes> & {
  relationships?: PolicyCheckRelationships;
};
export type PolicyCheckListResponse = ListResponse<PolicyCheckResource>;
export type PolicyCheckResponse = SingleResponse<PolicyCheckResource>;

export interface PolicyCheck {
  id: string;
  status: string;
  scope: string;
  result: unknown;
  sentinel?: unknown;
  statusTimestamps: {
    queuedAt?: string;
    passedAt?: string;
    hardFailedAt?: string;
    softFailedAt?: string;
    advisoryFailedAt?: string;
    overriddenAt?: string;
  };
  permissions: {
    canOverride: boolean;
  };
  actions: {
    isOverridable: boolean;
  };
  createdAt?: string;
  finishedAt?: string | null;
  runId?: string;
  outputUrl?: string | null;
}

export interface PolicyCheckFilter extends WhereClause<PolicyCheck> {
  _and?: PolicyCheckFilter[];
  _or?: PolicyCheckFilter[];
  _not?: PolicyCheckFilter;

  id?: StringComparisonExp;
  status?: StringComparisonExp;
  scope?: StringComparisonExp;
  runId?: StringComparisonExp;
}

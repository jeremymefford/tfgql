import {
  WhereClause,
  StringComparisonExp,
  DateTimeComparisonExp,
} from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef,
} from "../common/types/jsonApi";

export interface PolicyEvaluationAttributes {
  status: string;
  "policy-kind": string;
  "result-count": {
    "advisory-failed": number;
    errored: number;
    "mandatory-failed": number;
    passed: number;
  };
  "status-timestamps": {
    "passed-at"?: string;
    "queued-at"?: string;
    "running-at"?: string;
    "errored-at"?: string;
  };
  "created-at": string;
  "updated-at": string;
}

export interface PolicyEvaluationRelationships {
  "policy-attachable"?: {
    data?: ResourceRef;
  };
  "policy-set-outcomes"?: {
    data?: ResourceRef[];
    links?: {
      related?: string;
    };
  };
}

export type PolicyEvaluationResource =
  ResourceObject<PolicyEvaluationAttributes> & {
    relationships?: PolicyEvaluationRelationships;
  };

export type PolicyEvaluationResponse = SingleResponse<PolicyEvaluationResource>;
export type PolicyEvaluationListResponse =
  ListResponse<PolicyEvaluationResource>;

export interface PolicyEvaluation {
  id: string;
  status: string;
  policyKind: string;
  resultCount: {
    advisoryFailed: number;
    errored: number;
    mandatoryFailed: number;
    passed: number;
  };
  statusTimestamps: {
    passedAt?: string;
    queuedAt?: string;
    runningAt?: string;
    erroredAt?: string;
  };
  createdAt: string;
  updatedAt: string;
  policyAttachableId?: string;
  policySetOutcomeIds: string[];
}

export interface PolicyEvaluationFilter extends WhereClause<PolicyEvaluation> {
  _and?: PolicyEvaluationFilter[];
  _or?: PolicyEvaluationFilter[];
  _not?: PolicyEvaluationFilter;

  id?: StringComparisonExp;
  status?: StringComparisonExp;
  policyKind?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  updatedAt?: DateTimeComparisonExp;
  policyAttachableId?: StringComparisonExp;
}

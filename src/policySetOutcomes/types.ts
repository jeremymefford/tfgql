import { ResourceObject, ListResponse, SingleResponse } from "../common/types/jsonApi";

export interface PolicySetOutcomeAttributes {
  outcomes: unknown;
  error?: string | null;
  warnings?: unknown[];
  overridable: boolean;
  "policy-set-name": string;
  "policy-set-description"?: string | null;
  "result-count": {
    "advisory-failed": number;
    "mandatory-failed": number;
    passed: number;
    errored: number;
  };
  "policy-tool-version"?: string;
}

export interface PolicySetOutcomeRelationships {
  "policy-evaluation"?: {
    data?: { id: string; type: string };
  };
}

export type PolicySetOutcomeResource = ResourceObject<PolicySetOutcomeAttributes> & {
  relationships?: PolicySetOutcomeRelationships;
};

export type PolicySetOutcomeResponse = SingleResponse<PolicySetOutcomeResource>;
export type PolicySetOutcomeListResponse = ListResponse<PolicySetOutcomeResource>;

export interface PolicySetOutcome {
  id: string;
  outcomes: unknown;
  error?: string | null;
  warnings: unknown[];
  overridable: boolean;
  policySetName: string;
  policySetDescription?: string | null;
  resultCount: {
    advisoryFailed: number;
    mandatoryFailed: number;
    passed: number;
    errored: number;
  };
  policyToolVersion?: string;
  policyEvaluationId?: string;
}

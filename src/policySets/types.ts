import {
  WhereClause,
  StringComparisonExp,
  BooleanComparisonExp,
  IntComparisonExp,
  DateTimeComparisonExp,
} from "../common/filtering/types";
import {
  ResourceObject,
  ResourceRef,
  ListResponse,
  SingleResponse,
} from "../common/types/jsonApi";

export interface PolicySetAttributes {
  name: string;
  description: string | null;
  kind: string;
  global: boolean;
  "agent-enabled": boolean;
  "policy-tool-version": string;
  overridable: boolean;
  "workspace-count": number;
  "policy-count"?: number;
  "policies-path"?: string | null;
  versioned: boolean;
  "created-at": string;
  "updated-at": string;
  "vcs-repo"?: {
    branch?: string | null;
    identifier: string;
    "ingress-submodules": boolean;
    "oauth-token-id"?: string;
    "github-app-installation-id"?: string;
  };
}

export interface PolicySetRelationships {
  organization: { data: ResourceRef };
  policies?: { data: ResourceRef[] };
  projects?: { data: ResourceRef[] };
  workspaces?: { data: ResourceRef[] };
  "workspace-exclusions"?: { data: ResourceRef[] };
  "current-version"?: { data: ResourceRef };
  "newest-version"?: { data: ResourceRef };
}

export type PolicySetResource = ResourceObject<PolicySetAttributes> & {
  relationships?: PolicySetRelationships;
};

export type PolicySetResponse = SingleResponse<PolicySetResource>;
export type PolicySetListResponse = ListResponse<PolicySetResource>;

export interface PolicySet {
  id: string;
  name: string;
  description: string | null;
  kind: string;
  global: boolean;
  agentEnabled: boolean;
  policyToolVersion: string;
  overridable: boolean;
  workspaceCount: number;
  policyCount?: number;
  projectCount?: number;
  policiesPath?: string | null;
  versioned: boolean;
  createdAt: string;
  updatedAt: string;
  vcsRepo?: {
    branch?: string | null;
    identifier: string;
    ingressSubmodules: boolean;
    oauthTokenId?: string;
    githubAppInstallationId?: string;
  };
  organizationId: string;
  policyIds: string[];
  projectIds: string[];
  workspaceIds: string[];
  workspaceExclusionIds: string[];
  currentVersionId?: string;
  newestVersionId?: string;
}

export interface PolicySetFilter extends WhereClause<PolicySet> {
  _and?: PolicySetFilter[];
  _or?: PolicySetFilter[];
  _not?: PolicySetFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  description?: StringComparisonExp;
  kind?: StringComparisonExp;
  global?: BooleanComparisonExp;
  agentEnabled?: BooleanComparisonExp;
  policyToolVersion?: StringComparisonExp;
  overridable?: BooleanComparisonExp;
  workspaceCount?: IntComparisonExp;
  policyCount?: IntComparisonExp;
  projectCount?: IntComparisonExp;
  policiesPath?: StringComparisonExp;
  versioned?: BooleanComparisonExp;
  createdAt?: DateTimeComparisonExp;
  updatedAt?: DateTimeComparisonExp;
}

import {
  WhereClause,
  StringComparisonExp,
  IntComparisonExp,
  DateTimeComparisonExp,
} from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface PolicyAttributes {
  name: string;
  description: string | null;
  kind: string;
  query?: string;
  'enforcement-level': string;
  enforce?: {
    path: string;
    mode: string;
  }[];
  'policy-set-count': number;
  'updated-at': string | null;
}

export interface PolicyRelationships {
  organization: {
    data: ResourceRef;
  };
  'policy-sets': {
    data: ResourceRef[];
  };
}

export type PolicyResource = ResourceObject<PolicyAttributes> & {
  relationships?: PolicyRelationships;
};

export type PolicyResponse = SingleResponse<PolicyResource>;
export type PolicyListResponse = ListResponse<PolicyResource>;

export interface Policy {
  id: string;
  name: string;
  description: string | null;
  kind: string;
  query?: string;
  enforcementLevel: string;
  enforce?: {
    path: string;
    mode: string;
  }[];
  policySetCount: number;
  updatedAt: string | null;
  organizationId: string;
  policySetIds: string[];
}

export interface PolicyFilter extends WhereClause<Policy> {
  _and?: PolicyFilter[];
  _or?: PolicyFilter[];
  _not?: PolicyFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  description?: StringComparisonExp;
  kind?: StringComparisonExp;
  query?: StringComparisonExp;
  enforcementLevel?: StringComparisonExp;
  policySetCount?: IntComparisonExp;
  updatedAt?: DateTimeComparisonExp;
  organizationId?: StringComparisonExp;
  policySetIds?: StringComparisonExp;
}
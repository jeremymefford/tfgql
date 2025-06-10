import {
  WhereClause,
  StringComparisonExp,
  IntComparisonExp,
  DateTimeComparisonExp,
} from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface OrganizationTagAttributes {
  name: string;
  'created-at': string;
  'instance-count': number;
}

export interface OrganizationTagRelationships {
  organization?: {
    data: ResourceRef;
  };
}

export type OrganizationTagResource = ResourceObject<OrganizationTagAttributes> & {
  relationships?: OrganizationTagRelationships;
};

export type OrganizationTagResponse = SingleResponse<OrganizationTagResource>;
export type OrganizationTagListResponse = ListResponse<OrganizationTagResource>;

export interface OrganizationTag {
  id: string;
  name: string;
  createdAt: string;
  instanceCount: number;
  organizationId: string;
}

export interface OrganizationTagFilter extends WhereClause<OrganizationTag> {
  _and?: OrganizationTagFilter[];
  _or?: OrganizationTagFilter[];
  _not?: OrganizationTagFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  instanceCount?: IntComparisonExp;
  organizationId?: StringComparisonExp;
}
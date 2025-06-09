import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse } from '../common/types/jsonApi';

export interface PolicyAttributes {
  // TODO: define Policy attributes based on Terraform Cloud API
}

export interface PolicyRelationships {
  // TODO: define Policy relationships based on Terraform Cloud API
}

export type PolicyResource = ResourceObject<PolicyAttributes> & {
  relationships?: PolicyRelationships;
};

export type PolicyResponse = SingleResponse<PolicyResource>;
export type PolicyListResponse = ListResponse<PolicyResource>;

export interface Policy {
  id: string;
  // TODO: define Policy domain model fields
}

export interface PolicyFilter extends WhereClause<Policy> {
  _and?: PolicyFilter[];
  _or?: PolicyFilter[];
  _not?: PolicyFilter;

  // TODO: add Policy filter fields
}
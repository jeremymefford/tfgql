import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface OrganizationTagAttributes {
  // TODO: define OrganizationTag attributes based on Terraform Cloud API
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
  // TODO: define OrganizationTag domain model fields
}

export interface OrganizationTagFilter extends WhereClause<OrganizationTag> {
  _and?: OrganizationTagFilter[];
  _or?: OrganizationTagFilter[];
  _not?: OrganizationTagFilter;

  // TODO: add OrganizationTag filter fields
}
import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface ApplyAttributes {
  // TODO: define Apply attributes based on Terraform Cloud API
}

export interface ApplyRelationships {
  run?: {
    data: ResourceRef;
  };
}

export type ApplyResource = ResourceObject<ApplyAttributes> & {
  relationships?: ApplyRelationships;
};

export type ApplyResponse = SingleResponse<ApplyResource>;
export type ApplyListResponse = ListResponse<ApplyResource>;

export interface Apply {
  id: string;
  // TODO: define Apply domain model fields
}

export interface ApplyFilter extends WhereClause<Apply> {
  _and?: ApplyFilter[];
  _or?: ApplyFilter[];
  _not?: ApplyFilter;

  // TODO: add Apply filter fields
}
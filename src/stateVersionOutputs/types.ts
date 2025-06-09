import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface StateVersionOutputAttributes {
  // TODO: define StateVersionOutput attributes based on Terraform Cloud API
}

export interface StateVersionOutputRelationships {
  stateVersion?: {
    data: ResourceRef;
  };
}

export type StateVersionOutputResource = ResourceObject<StateVersionOutputAttributes> & {
  relationships?: StateVersionOutputRelationships;
};

export type StateVersionOutputResponse = SingleResponse<StateVersionOutputResource>;
export type StateVersionOutputListResponse = ListResponse<StateVersionOutputResource>;

export interface StateVersionOutput {
  id: string;
  // TODO: define StateVersionOutput domain model fields
}

export interface StateVersionOutputFilter extends WhereClause<StateVersionOutput> {
  _and?: StateVersionOutputFilter[];
  _or?: StateVersionOutputFilter[];
  _not?: StateVersionOutputFilter;

  // TODO: add StateVersionOutput filter fields
}
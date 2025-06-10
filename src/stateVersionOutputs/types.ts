import { WhereClause, StringComparisonExp, BooleanComparisonExp } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface StateVersionOutputAttributes {
  name: string;
  sensitive: boolean;
  type: string;
  value: any;
  'detailed-type': any;
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
  name: string;
  sensitive: boolean;
  type: string;
  value: any;
  detailedType: any;
  stateVersionId?: string;
}

export interface StateVersionOutputFilter extends WhereClause<StateVersionOutput> {
  _and?: StateVersionOutputFilter[];
  _or?: StateVersionOutputFilter[];
  _not?: StateVersionOutputFilter;

  id?: StringComparisonExp;
  name?: StringComparisonExp;
  sensitive?: BooleanComparisonExp;
  type?: StringComparisonExp;
  stateVersionId?: StringComparisonExp;
}
import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface TeamTokenAttributes {
  // TODO: define TeamToken attributes based on Terraform Cloud API
}

export interface TeamTokenRelationships {
  team?: {
    data: ResourceRef;
  };
}

export type TeamTokenResource = ResourceObject<TeamTokenAttributes> & {
  relationships?: TeamTokenRelationships;
};

export type TeamTokenResponse = SingleResponse<TeamTokenResource>;
export type TeamTokenListResponse = ListResponse<TeamTokenResource>;

export interface TeamToken {
  id: string;
  // TODO: define TeamToken domain model fields
}

export interface TeamTokenFilter extends WhereClause<TeamToken> {
  _and?: TeamTokenFilter[];
  _or?: TeamTokenFilter[];
  _not?: TeamTokenFilter;

  // TODO: add TeamToken filter fields
}
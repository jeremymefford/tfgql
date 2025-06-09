import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface AgentTokenAttributes {
  // TODO: define AgentToken attributes based on Terraform Cloud API
}

export interface AgentTokenRelationships {
  pool: {
    data: ResourceRef;
  };
}

export type AgentTokenResource = ResourceObject<AgentTokenAttributes> & {
  relationships?: AgentTokenRelationships;
};

export type AgentTokenResponse = SingleResponse<AgentTokenResource>;
export type AgentTokenListResponse = ListResponse<AgentTokenResource>;

export interface AgentToken {
  id: string;
  poolId: string;
  // TODO: define additional AgentToken domain model fields
}

export interface AgentTokenFilter extends WhereClause<AgentToken> {
  _and?: AgentTokenFilter[];
  _or?: AgentTokenFilter[];
  _not?: AgentTokenFilter;

  // TODO: add AgentToken filter fields
}
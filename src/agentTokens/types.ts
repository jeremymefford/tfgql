import { WhereClause, StringComparisonExp, DateTimeComparisonExp } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface AgentTokenAttributes {
  'created-at': string;
  'last-used-at': string | null;
  description: string;
  token: string | null;
}

export interface AgentTokenRelationships {
  pool: {
    data: ResourceRef;
  };
  'created-by': {
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
  createdAt: string;
  lastUsedAt: string | null;
  description: string;
  token: string | null;
  createdById: string;
}

export interface AgentTokenFilter extends WhereClause<AgentToken> {
  _and?: AgentTokenFilter[];
  _or?: AgentTokenFilter[];
  _not?: AgentTokenFilter;

  id?: StringComparisonExp;
  poolId?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  lastUsedAt?: DateTimeComparisonExp;
  description?: StringComparisonExp;
  token?: StringComparisonExp;
  createdById?: StringComparisonExp;
}
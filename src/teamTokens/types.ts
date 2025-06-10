import { WhereClause, StringComparisonExp, DateTimeComparisonExp } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface TeamTokenAttributes {
  "created-at": string;
  "last-used-at": string | null;
  description: string | null;
  token: string | null;
  "expired-at": string | null;
}

export interface TeamTokenRelationships {
  team: {
    data: ResourceRef;
  };
  "created-by": {
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
  teamId: string;
  createdAt: string;
  lastUsedAt: string | null;
  description: string | null;
  token: string | null;
  expiredAt: string | null;
  createdById: string;
}

export interface TeamTokenFilter extends WhereClause<TeamToken> {
  _and?: TeamTokenFilter[];
  _or?: TeamTokenFilter[];
  _not?: TeamTokenFilter;

  id?: StringComparisonExp;
  teamId?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  lastUsedAt?: DateTimeComparisonExp;
  description?: StringComparisonExp;
  token?: StringComparisonExp;
  expiredAt?: DateTimeComparisonExp;
  createdById?: StringComparisonExp;
}
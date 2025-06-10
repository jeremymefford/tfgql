import { WhereClause, StringComparisonExp } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface TeamMembershipAttributes {
  // attributes are empty; memberships are represented by relationships only
}

export interface TeamMembershipRelationships {
  team: {
    data: ResourceRef;
  };
  user: {
    data: ResourceRef;
  };
}

export type TeamMembershipResource = ResourceObject<TeamMembershipAttributes> & {
  relationships?: TeamMembershipRelationships;
};

export type TeamMembershipResponse = SingleResponse<TeamMembershipResource>;
export type TeamMembershipListResponse = ListResponse<TeamMembershipResource>;

export interface TeamMembership {
  id: string;
  teamId: string;
  userId: string;
}

export interface TeamMembershipFilter extends WhereClause<TeamMembership> {
  _and?: TeamMembershipFilter[];
  _or?: TeamMembershipFilter[];
  _not?: TeamMembershipFilter;

  id?: StringComparisonExp;
  teamId?: StringComparisonExp;
  userId?: StringComparisonExp;
}
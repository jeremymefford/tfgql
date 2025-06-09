import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface TeamMembershipAttributes {
  // TODO: define TeamMembership attributes based on Terraform Cloud API
}

export interface TeamMembershipRelationships {
  team?: {
    data: ResourceRef;
  };
  user?: {
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
  // TODO: define TeamMembership domain model fields
}

export interface TeamMembershipFilter extends WhereClause<TeamMembership> {
  _and?: TeamMembershipFilter[];
  _or?: TeamMembershipFilter[];
  _not?: TeamMembershipFilter;

  // TODO: add TeamMembership filter fields
}
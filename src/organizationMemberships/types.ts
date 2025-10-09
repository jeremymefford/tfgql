import { WhereClause, StringComparisonExp } from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef,
} from "../common/types/jsonApi";

export interface OrganizationMembershipAttributes {
  status: string;
}

export interface OrganizationMembershipRelationships {
  organization: {
    data: ResourceRef;
  };
  user: {
    data: ResourceRef;
  };
  teams: {
    data: ResourceRef[];
  };
}

export type OrganizationMembershipResource =
  ResourceObject<OrganizationMembershipAttributes> & {
    relationships?: OrganizationMembershipRelationships;
  };

export type OrganizationMembershipResponse =
  SingleResponse<OrganizationMembershipResource>;
export type OrganizationMembershipListResponse =
  ListResponse<OrganizationMembershipResource>;

export interface OrganizationMembership {
  id: string;
  status: string;
  organizationId: string;
  userId: string;
  teamIds: string[];
}

export interface OrganizationMembershipFilter
  extends WhereClause<OrganizationMembership> {
  _and?: OrganizationMembershipFilter[];
  _or?: OrganizationMembershipFilter[];
  _not?: OrganizationMembershipFilter;

  id?: StringComparisonExp;
  status?: StringComparisonExp;
  organizationId?: StringComparisonExp;
  userId?: StringComparisonExp;
  teamIds?: StringComparisonExp;
}

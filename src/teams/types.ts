import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';
import { Organization } from '../organizations/types';

export interface TeamAttributes {
  name: string;
  'sso-team-id': string;
  'users-count': number;
  visibility: string;
  'allow-member-token-management': boolean;
  permissions: { [key: string]: boolean };
  'organization-access': { [key: string]: boolean };
}

export interface TeamRelationships {
  organization: {
    data: ResourceRef;
  };
  users: {
    data: ResourceRef[];
  };
}

export type TeamResource = ResourceObject<TeamAttributes> & {
  relationships: TeamRelationships;
};

export type TeamListResponse = ListResponse<TeamResource>;
export type TeamResponse = SingleResponse<TeamResource>;

export interface Team {
  id: string;
  name: string;
  ssoTeamId: string | null;
  usersCount: number;
  visibility: string;
  allowMemberTokenManagement: boolean;
  permissions: { [key: string]: boolean };
  organizationAccess: { [key: string]: boolean };
  organizationId: string;
  userIds: string[];
}

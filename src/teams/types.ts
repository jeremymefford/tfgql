import {
  ResourceObject,
  ListResponse,
  SingleResponse,
  ResourceRef,
} from "../common/types/jsonApi";
import {
  StringComparisonExp,
  IntComparisonExp,
  BooleanComparisonExp,
  WhereClause,
} from "../common/filtering/types";

export interface TeamAttributes {
  name: string;
  "sso-team-id": string;
  "users-count": number;
  visibility: string;
  "allow-member-token-management": boolean;
  permissions: { [key: string]: boolean };
  "organization-access": { [key: string]: boolean };
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
  permissions: {
    canUpdateMembership: boolean;
    canDestroy: boolean;
    canUpdateOrganizationAccess: boolean;
    canUpdateApiToken: boolean;
    canUpdateVisibility: boolean;
    canUpdateName: boolean;
    canUpdateSsoTeamId: boolean;
    canUpdateMemberTokenManagement: boolean;
    canViewApiToken: boolean;
  };
  organizationAccess: {
    managePolicies: boolean;
    manageWorkspaces: boolean;
    manageVcsSettings: boolean;
    managePolicyOverrides: boolean;
    manageModules: boolean;
    manageProviders: boolean;
    manageRunTasks: boolean;
    manageProjects: boolean;
    manageMembership: boolean;
    manageTeams: boolean;
    manageOrganizationAccess: boolean;
    accessSecretTeams: boolean;
    readProjects: boolean;
    readWorkspaces: boolean;
    manageAgentPools: boolean;
  };
  organizationId: string;
  userIds: string[];
}

export interface TeamPermissionsFilter
  extends WhereClause<Team["permissions"]> {
  _and?: TeamPermissionsFilter[];
  _or?: TeamPermissionsFilter[];
  _not?: TeamPermissionsFilter;

  canUpdateMembership?: BooleanComparisonExp;
  canDestroy?: BooleanComparisonExp;
  canUpdateOrganizationAccess?: BooleanComparisonExp;
  canUpdateApiToken?: BooleanComparisonExp;
  canUpdateVisibility?: BooleanComparisonExp;
  canUpdateName?: BooleanComparisonExp;
  canUpdateSsoTeamId?: BooleanComparisonExp;
  canUpdateMemberTokenManagement?: BooleanComparisonExp;
  canViewApiToken?: BooleanComparisonExp;
}

export interface TeamOrganizationAccessFilter
  extends WhereClause<Team["organizationAccess"]> {
  _and?: TeamOrganizationAccessFilter[];
  _or?: TeamOrganizationAccessFilter[];
  _not?: TeamOrganizationAccessFilter;

  managePolicies?: BooleanComparisonExp;
  manageWorkspaces?: BooleanComparisonExp;
  manageVcsSettings?: BooleanComparisonExp;
  managePolicyOverrides?: BooleanComparisonExp;
  manageModules?: BooleanComparisonExp;
  manageProviders?: BooleanComparisonExp;
  manageRunTasks?: BooleanComparisonExp;
  manageProjects?: BooleanComparisonExp;
  manageMembership?: BooleanComparisonExp;
  manageTeams?: BooleanComparisonExp;
  manageOrganizationAccess?: BooleanComparisonExp;
  accessSecretTeams?: BooleanComparisonExp;
  readProjects?: BooleanComparisonExp;
  readWorkspaces?: BooleanComparisonExp;
  manageAgentPools?: BooleanComparisonExp;
}

export interface TeamFilter
  extends WhereClause<
    Team,
    {
      permissions: TeamPermissionsFilter;
      organizationAccess: TeamOrganizationAccessFilter;
    }
  > {
  id?: StringComparisonExp;
  name?: StringComparisonExp;
  ssoTeamId?: StringComparisonExp;
  usersCount?: IntComparisonExp;
  visibility?: StringComparisonExp;
  allowMemberTokenManagement?: BooleanComparisonExp;
  permissions?: TeamPermissionsFilter;
  organizationAccess?: TeamOrganizationAccessFilter;
}

import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';
import { Organization } from '../organizations/types';
import {
    StringComparisonExp,
    IntComparisonExp,
    BooleanComparisonExp,
    WhereClause
} from '../common/filtering/types';
import { UserFilter } from '../users/types';

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

export interface TeamPermissions {
    canUpdateMembership: boolean;
    canDestroy: boolean;
    canUpdateOrganizationAccess: boolean;
    canUpdateApiToken: boolean;
    canUpdateVisibility: boolean;
    canUpdateName: boolean;
    canUpdateSsoTeamId: boolean;
    canUpdateMemberTokenManagement: boolean;
    canViewApiToken: boolean;
}

export interface TeamOrganizationAccess {
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
}

export interface Team {
    id: string;
    name: string;
    ssoTeamId: string | null;
    usersCount: number;
    visibility: string;
    allowMemberTokenManagement: boolean;
    permissions: TeamPermissions;
    organizationAccess: TeamOrganizationAccess;
    organizationId: string;
    userIds: string[];
}

export interface TeamPermissionsFilter extends WhereClause<TeamPermissions> {
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

export interface TeamOrganizationAccessFilter extends WhereClause<TeamOrganizationAccess> {
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

export interface TeamFilter extends WhereClause<
    Team, {
        permissions: TeamPermissionsFilter;
        organizationAccess: TeamOrganizationAccessFilter;
    }> {
    id?: StringComparisonExp;
    name?: StringComparisonExp;
    ssoTeamId?: StringComparisonExp;
    usersCount?: IntComparisonExp;
    visibility?: StringComparisonExp;
    allowMemberTokenManagement?: BooleanComparisonExp;
    permissions?: TeamPermissionsFilter;
    organizationAccess?: TeamOrganizationAccessFilter;
}

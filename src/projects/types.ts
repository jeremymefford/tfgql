import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';
import {
    BooleanComparisonExp,
    StringComparisonExp,
    IntComparisonExp,
    DateTimeComparisonExp,
    WhereClause
} from '../common/filtering/types';

export interface ProjectPermissions {
    'can-read': boolean;
    'can-update': boolean;
    'can-destroy': boolean;
    'can-create-workspace': boolean;
    'can-move-workspace': boolean;
    'can-move-stack': boolean;
    'can-deploy-no-code-modules': boolean;
    'can-read-teams': boolean;
    'can-manage-tags': boolean;
    'can-manage-teams': boolean;
    'can-manage-in-hcp': boolean;
    'can-manage-ephemeral-workspace-for-projects': boolean;
    'can-manage-varsets': boolean;
}

export interface ProjectAttributes {
    name: string;
    description: string | null;
    'created-at': string;
    'workspace-count': number;
    'team-count': number;
    'stack-count': number;
    'auto-destroy-activity-duration'?: string | null;
    permissions: ProjectPermissions;
    relationships?: ProjectRelationships;
}

export interface ProjectRelationships {
    organization: {
        data: ResourceRef;
    };
}

export type ProjectResource = ResourceObject<ProjectAttributes> & {
    relationships: ProjectRelationships;
};
export type ProjectResponse = SingleResponse<ProjectResource>;
export type ProjectListResponse = ListResponse<ProjectResource>;

export interface Project {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    workspaceCount: number;
    teamCount: number;
    stackCount: number;
    autoDestroyActivityDuration?: string | null;
    permissions: {
        canRead: boolean;
        canUpdate: boolean;
        canDestroy: boolean;
        canCreateWorkspace: boolean;
        canMoveWorkspace: boolean;
        canMoveStack: boolean;
        canDeployNoCodeModules: boolean;
        canReadTeams: boolean;
        canManageTags: boolean;
        canManageTeams: boolean;
        canManageInHcp: boolean;
        canManageEphemeralWorkspaceForProjects: boolean;
        canManageVarsets: boolean;
    };
    organizationId?: string;
}

export interface ProjectPermissionsFilter extends WhereClause<Project['permissions']> {
    _and?: ProjectPermissionsFilter[];
    _or?: ProjectPermissionsFilter[];
    _not?: ProjectPermissionsFilter;

    canRead?: BooleanComparisonExp;
    canUpdate?: BooleanComparisonExp;
    canDestroy?: BooleanComparisonExp;
    canCreateWorkspace?: BooleanComparisonExp;
    canMoveWorkspace?: BooleanComparisonExp;
    canMoveStack?: BooleanComparisonExp;
    canDeployNoCodeModules?: BooleanComparisonExp;
    canReadTeams?: BooleanComparisonExp;
    canManageTags?: BooleanComparisonExp;
    canManageTeams?: BooleanComparisonExp;
    canManageInHcp?: BooleanComparisonExp;
    canManageEphemeralWorkspaceForProjects?: BooleanComparisonExp;
    canManageVarsets?: BooleanComparisonExp;
}

export interface ProjectFilter extends WhereClause<
    Project, {
        permissions: ProjectPermissionsFilter
    }> {
    _and?: ProjectFilter[];
    _or?: ProjectFilter[];
    _not?: ProjectFilter;

    id?: StringComparisonExp;
    name?: StringComparisonExp;
    description?: StringComparisonExp;
    createdAt?: DateTimeComparisonExp;
    workspaceCount?: IntComparisonExp;
    teamCount?: IntComparisonExp;
    stackCount?: IntComparisonExp;
    autoDestroyActivityDuration?: StringComparisonExp;
    permissions?: ProjectPermissionsFilter;
}

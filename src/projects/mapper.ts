import { DomainMapper } from '../common/middleware/domainMapper';
import { Project, ProjectResource } from './types';

export const projectsMapper: DomainMapper<ProjectResource, Project> = {
    map(resource: ProjectResource): Project {
        const attr = resource.attributes;
        return {
            id: resource.id,
            name: attr.name,
            description: attr.description,
            createdAt: attr['created-at'],
            workspaceCount: attr['workspace-count'],
            teamCount: attr['team-count'],
            stackCount: attr['stack-count'],
            autoDestroyActivityDuration: attr['auto-destroy-activity-duration'] ?? null,
            permissions: {
                canRead: attr.permissions['can-read'],
                canUpdate: attr.permissions['can-update'],
                canDestroy: attr.permissions['can-destroy'],
                canCreateWorkspace: attr.permissions['can-create-workspace'],
                canMoveWorkspace: attr.permissions['can-move-workspace'],
                canMoveStack: attr.permissions['can-move-stack'],
                canDeployNoCodeModules: attr.permissions['can-deploy-no-code-modules'],
                canReadTeams: attr.permissions['can-read-teams'],
                canManageTags: attr.permissions['can-manage-tags'],
                canManageTeams: attr.permissions['can-manage-teams'],
                canManageInHcp: attr.permissions['can-manage-in-hcp'],
                canManageEphemeralWorkspaceForProjects: attr.permissions['can-manage-ephemeral-workspace-for-projects'],
                canManageVarsets: attr.permissions['can-manage-varsets'],
            },
            organizationId: resource.relationships?.organization?.data?.id
        };
    }
};

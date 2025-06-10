import { DomainMapper } from '../common/middleware/domainMapper';
import { ProjectTeamAccessResource, ProjectTeamAccess } from './types';

export const projectTeamAccessMapper: DomainMapper<ProjectTeamAccessResource, ProjectTeamAccess> = {
  map(resource: ProjectTeamAccessResource): ProjectTeamAccess {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      access: attrs.access,
      projectAccess: {
        settings: attrs['project-access'].settings,
        teams: attrs['project-access'].teams,
      },
      workspaceAccess: {
        create: attrs['workspace-access']['create'],
        move: attrs['workspace-access']['move'],
        locking: attrs['workspace-access']['locking'],
        delete: attrs['workspace-access']['delete'],
        runs: attrs['workspace-access']['runs'],
        variables: attrs['workspace-access']['variables'],
        stateVersions: attrs['workspace-access']['state-versions'],
        sentinelMocks: attrs['workspace-access']['sentinel-mocks'],
        runTasks: attrs['workspace-access']['run-tasks'],
      },
      projectId: resource.relationships!.project.data.id,
      teamId: resource.relationships!.team.data.id,
    };
  },
};
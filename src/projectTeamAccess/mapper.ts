import { DomainMapper } from '../common/middleware/domainMapper';
import { ProjectTeamAccessResource, ProjectTeamAccess } from './types';

export const projectTeamAccessMapper: DomainMapper<ProjectTeamAccessResource, ProjectTeamAccess> = {
  map(resource: ProjectTeamAccessResource): ProjectTeamAccess {
    return {
      id: resource.id,
      // TODO: map additional fields from resource.attributes and resource.relationships
    };
  }
};
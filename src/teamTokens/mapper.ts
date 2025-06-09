import { DomainMapper } from '../common/middleware/domainMapper';
import { TeamTokenResource, TeamToken } from './types';

export const teamTokenMapper: DomainMapper<TeamTokenResource, TeamToken> = {
  map(resource: TeamTokenResource): TeamToken {
    return {
      id: resource.id,
      // TODO: map additional fields from resource.attributes and resource.relationships
    };
  }
};
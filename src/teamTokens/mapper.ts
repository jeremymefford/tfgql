import { DomainMapper } from '../common/middleware/domainMapper';
import { TeamTokenResource, TeamToken } from './types';

export const teamTokenMapper: DomainMapper<TeamTokenResource, TeamToken> = {
  map(resource: TeamTokenResource): TeamToken {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      teamId: resource.relationships!.team.data.id,
      createdAt: attrs['created-at'],
      lastUsedAt: attrs['last-used-at'],
      description: attrs.description,
      token: attrs.token,
      expiredAt: attrs['expired-at'],
      createdById: resource.relationships!['created-by'].data.id,
    };
  },
};
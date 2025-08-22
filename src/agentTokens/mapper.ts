import { DomainMapper } from '../common/middleware/domainMapper';
import { AgentTokenResource, AgentToken } from './types';

export const agentTokenMapper: DomainMapper<AgentTokenResource, AgentToken> = {
  map(resource: AgentTokenResource): AgentToken {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      poolId: null, // will have to be filled in upstream
      createdAt: attrs['created-at'],
      lastUsedAt: attrs['last-used-at'],
      description: attrs.description,
      createdById: resource.relationships?.['created-by'].data.id || '',
    };
  }
};
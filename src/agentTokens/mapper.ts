import { DomainMapper } from '../common/middleware/domainMapper';
import { AgentTokenResource, AgentToken } from './types';

export const agentTokenMapper: DomainMapper<AgentTokenResource, AgentToken> = {
  map(resource: AgentTokenResource): AgentToken {
    return {
      id: resource.id,
      poolId: resource.relationships?.pool.data.id || '',
      // TODO: map additional fields from resource.attributes
    };
  }
};
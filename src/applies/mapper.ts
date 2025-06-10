import { DomainMapper } from '../common/middleware/domainMapper';
import { ApplyResource, Apply } from './types';

export const applyMapper: DomainMapper<ApplyResource, Apply> = {
  map(resource: ApplyResource): Apply {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      mode: attrs['execution-details'].mode,
      agentId: attrs['execution-details']['agent-id'],
      agentName: attrs['execution-details']['agent-name'],
      agentPoolId: attrs['execution-details']['agent-pool-id'],
      agentPoolName: attrs['execution-details']['agent-pool-name'],
      status: attrs.status,
      queuedAt: attrs['status-timestamps']['queued-at'],
      startedAt: attrs['status-timestamps']['started-at'],
      finishedAt: attrs['status-timestamps']['finished-at'],
      logReadUrl: attrs['log-read-url'],
      resourceAdditions: attrs['resource-additions'],
      resourceChanges: attrs['resource-changes'],
      resourceDestructions: attrs['resource-destructions'],
      resourceImports: attrs['resource-imports'],
      stateVersionIds:
        resource.relationships?.['state-versions']?.data.map(rel => rel.id) || [],
    };
  }
};
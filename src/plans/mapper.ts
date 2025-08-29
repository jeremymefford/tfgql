import { DomainMapper } from '../common/middleware/domainMapper';
import { PlanResource, Plan } from './types';

export const planMapper: DomainMapper<PlanResource, Plan> = {
  map(resource: PlanResource): Plan {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      mode: attrs['execution-details'].mode,
      agentId: attrs['execution-details']?.['agent-id'],
      agentName: attrs['execution-details']?.['agent-name'],
      agentPoolId: attrs['execution-details']?.['agent-pool-id'],
      agentPoolName: attrs['execution-details']?.['agent-pool-name'],
      generatedConfiguration: attrs['generated-configuration'],
      hasChanges: attrs['has-changes'],
      resourceAdditions: attrs['resource-additions'],
      resourceChanges: attrs['resource-changes'],
      resourceDestructions: attrs['resource-destructions'],
      resourceImports: attrs['resource-imports'],
      status: attrs.status,
      agentQueuedAt: attrs['status-timestamps']?.['agent-queued-at'],
      pendingAt: attrs['status-timestamps']?.['pending-at'],
      startedAt: attrs['status-timestamps']?.['started-at'],
      finishedAt: attrs['status-timestamps']?.['finished-at'],
      logReadUrl: attrs['log-read-url'],
      structuredRunOutputEnabled: attrs['structured-run-output-enabled'],
      jsonOutputRedactedUrl: resource.links['json-output-redacted'],
      jsonSchema: resource.links['json-schema'],
      jsonOutputUrl: resource.links['json-output'],
    };
  }
};
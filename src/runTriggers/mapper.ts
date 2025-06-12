import { DomainMapper } from '../common/middleware/domainMapper';
import { RunTriggerResource, RunTrigger } from './types';

export const runTriggerMapper: DomainMapper<RunTriggerResource, RunTrigger> = {
  map(resource: RunTriggerResource): RunTrigger {
    const a = resource.attributes;
    return {
      id: resource.id,
      workspaceName: a['workspace-name'],
      sourceableName: a['sourceable-name'],
      createdAt: a['created-at'],
      workspace: resource.relationships?.workspace?.data,
      sourceable: resource.relationships?.sourceable?.data
    };
  }
};
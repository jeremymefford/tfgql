

import { DomainMapper } from '../common/middleware/domainMapper';
import { WorkspaceResource, WorkspaceResourceResource } from './types';

export const workspaceResourceMapper: DomainMapper<WorkspaceResourceResource, WorkspaceResource> = {
  map(resource: WorkspaceResourceResource): WorkspaceResource {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      address: attrs.address,
      name: attrs.name,
      createdAt: attrs['created-at'],
      updatedAt: attrs['updated-at'],
      module: attrs.module,
      provider: attrs.provider,
      providerType: attrs['provider-type'],
      modifiedByStateVersionId: attrs['modified-by-state-version-id'],
      nameIndex: attrs['name-index'] ?? null,
      workspaceId: undefined // This will be set in the datasource
    };
  },
};
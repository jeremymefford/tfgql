import { DomainMapper } from '../common/middleware/domainMapper';
import { OrganizationTagResource, OrganizationTag } from './types';

export const organizationTagMapper: DomainMapper<OrganizationTagResource, OrganizationTag> = {
  map(resource: OrganizationTagResource): OrganizationTag {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      name: attrs.name,
      createdAt: attrs['created-at'],
      instanceCount: attrs['instance-count'],
      organizationId: resource.relationships?.organization?.data.id || '',
    };
  }
};
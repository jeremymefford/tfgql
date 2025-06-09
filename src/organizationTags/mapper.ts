import { DomainMapper } from '../common/middleware/domainMapper';
import { OrganizationTagResource, OrganizationTag } from './types';

export const organizationTagMapper: DomainMapper<OrganizationTagResource, OrganizationTag> = {
  map(resource: OrganizationTagResource): OrganizationTag {
    return {
      id: resource.id,
      // TODO: map additional fields from resource.attributes and resource.relationships
    };
  }
};
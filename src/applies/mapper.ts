import { DomainMapper } from '../common/middleware/domainMapper';
import { ApplyResource, Apply } from './types';

export const applyMapper: DomainMapper<ApplyResource, Apply> = {
  map(resource: ApplyResource): Apply {
    return {
      id: resource.id,
      // TODO: map additional fields from resource.attributes and resource.relationships
    };
  }
};
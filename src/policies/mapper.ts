import { DomainMapper } from '../common/middleware/domainMapper';
import { PolicyResource, Policy } from './types';

export const policyMapper: DomainMapper<PolicyResource, Policy> = {
  map(resource: PolicyResource): Policy {
    return {
      id: resource.id,
      // TODO: map additional fields from resource.attributes and resource.relationships
    };
  }
};
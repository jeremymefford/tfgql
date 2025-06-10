import { DomainMapper } from '../common/middleware/domainMapper';
import { PolicyResource, Policy } from './types';

export const policyMapper: DomainMapper<PolicyResource, Policy> = {
  map(resource: PolicyResource): Policy {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      name: attrs.name,
      description: attrs.description,
      kind: attrs.kind,
      query: attrs.query,
      enforcementLevel: attrs['enforcement-level'],
      enforce: attrs.enforce,
      policySetCount: attrs['policy-set-count'],
      updatedAt: attrs['updated-at'],
      organizationId: resource.relationships!.organization.data.id,
      policySetIds: resource.relationships!['policy-sets'].data.map(rel => rel.id),
    };
  }
};
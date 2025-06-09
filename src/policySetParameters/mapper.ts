import { DomainMapper } from '../common/middleware/domainMapper';
import { PolicySetParameterResource, PolicySetParameter } from './types';

export const policySetParameterMapper: DomainMapper<PolicySetParameterResource, PolicySetParameter> = {
  map(resource: PolicySetParameterResource): PolicySetParameter {
    return {
      id: resource.id,
      key: resource.attributes.key,
      value: resource.attributes.value,
      sensitive: resource.attributes.sensitive,
      category: resource.attributes.category,
      policySetId: resource.relationships?.configurable.data.id
    };
  }
};
import { DomainMapper } from '../common/middleware/domainMapper';
import { StateVersionOutputResource, StateVersionOutput } from './types';

export const stateVersionOutputMapper: DomainMapper<StateVersionOutputResource, StateVersionOutput> = {
  map(resource: StateVersionOutputResource): StateVersionOutput {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      name: attrs.name,
      sensitive: attrs.sensitive,
      type: attrs.type,
      value: attrs.value,
      detailedType: attrs['detailed-type'],
      stateVersionId: resource.relationships?.stateVersion?.data.id,
    };
  },
};
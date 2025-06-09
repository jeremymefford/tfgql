import { DomainMapper } from '../common/middleware/domainMapper';
import { StateVersionOutputResource, StateVersionOutput } from './types';

export const stateVersionOutputMapper: DomainMapper<StateVersionOutputResource, StateVersionOutput> = {
  map(resource: StateVersionOutputResource): StateVersionOutput {
    return {
      id: resource.id,
      // TODO: map additional fields from resource.attributes and resource.relationships
    };
  }
};
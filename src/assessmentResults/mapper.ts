import { DomainMapper } from '../common/middleware/domainMapper';
import { AssessmentResultResource, AssessmentResult } from './types';

export const assessmentResultMapper: DomainMapper<AssessmentResultResource, AssessmentResult> = {
  map(resource: AssessmentResultResource): AssessmentResult {
    return {
      id: resource.id,
      // TODO: map additional fields from resource.attributes and resource.relationships
    };
  }
};
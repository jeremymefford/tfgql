import { DomainMapper } from '../common/middleware/domainMapper';
import { PolicyEvaluationResource, PolicyEvaluation } from './types';

export const policyEvaluationMapper: DomainMapper<PolicyEvaluationResource, PolicyEvaluation> = {
  map(resource: PolicyEvaluationResource): PolicyEvaluation {
    return {
      id: resource.id,
      // TODO: map additional fields from resource.attributes and resource.relationships
    };
  }
};
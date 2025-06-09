import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface PolicyEvaluationAttributes {
  // TODO: define PolicyEvaluation attributes based on Terraform Cloud API
}

export interface PolicyEvaluationRelationships {
  policySet?: {
    data: ResourceRef;
  };
}

export type PolicyEvaluationResource = ResourceObject<PolicyEvaluationAttributes> & {
  relationships?: PolicyEvaluationRelationships;
};

export type PolicyEvaluationResponse = SingleResponse<PolicyEvaluationResource>;
export type PolicyEvaluationListResponse = ListResponse<PolicyEvaluationResource>;

export interface PolicyEvaluation {
  id: string;
  // TODO: define PolicyEvaluation domain model fields
}

export interface PolicyEvaluationFilter extends WhereClause<PolicyEvaluation> {
  _and?: PolicyEvaluationFilter[];
  _or?: PolicyEvaluationFilter[];
  _not?: PolicyEvaluationFilter;

  // TODO: add PolicyEvaluation filter fields
}
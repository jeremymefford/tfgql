import { WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse } from '../common/types/jsonApi';

export interface AssessmentResultAttributes {
  // TODO: define AssessmentResult attributes based on Terraform Cloud API
}

export interface AssessmentResultRelationships {
  // TODO: define AssessmentResult relationships based on Terraform Cloud API
}

export type AssessmentResultResource = ResourceObject<AssessmentResultAttributes> & {
  relationships?: AssessmentResultRelationships;
};

export type AssessmentResultResponse = SingleResponse<AssessmentResultResource>;
export type AssessmentResultListResponse = ListResponse<AssessmentResultResource>;

export interface AssessmentResult {
  id: string;
  // TODO: define AssessmentResult domain model fields
}

export interface AssessmentResultFilter extends WhereClause<AssessmentResult> {
  _and?: AssessmentResultFilter[];
  _or?: AssessmentResultFilter[];
  _not?: AssessmentResultFilter;

  // TODO: add AssessmentResult filter fields
}
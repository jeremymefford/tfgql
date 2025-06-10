import { WhereClause, StringComparisonExp, BooleanComparisonExp, DateTimeComparisonExp } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse } from '../common/types/jsonApi';

export interface AssessmentResultAttributes {
  drifted: boolean;
  succeeded: boolean;
  'error-msg': string | null;
  'created-at': string;
}

export interface AssessmentResultRelationships {}

export type AssessmentResultResource = ResourceObject<AssessmentResultAttributes> & {
  relationships?: AssessmentResultRelationships;
};

export type AssessmentResultResponse = SingleResponse<AssessmentResultResource>;
export type AssessmentResultListResponse = ListResponse<AssessmentResultResource>;

export interface AssessmentResult {
  id: string;
  drifted: boolean;
  succeeded: boolean;
  errorMessage: string | null;
  createdAt: string;
}

export interface AssessmentResultFilter extends WhereClause<AssessmentResult> {
  _and?: AssessmentResultFilter[];
  _or?: AssessmentResultFilter[];
  _not?: AssessmentResultFilter;

  id?: StringComparisonExp;
  drifted?: BooleanComparisonExp;
  succeeded?: BooleanComparisonExp;
  errorMessage?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
}
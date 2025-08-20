import {
  WhereClause,
  StringComparisonExp,
  IntComparisonExp,
  DateTimeComparisonExp,
  BooleanComparisonExp,
} from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface ApplyAttributes {
  'execution-details': {
    mode?: string;
  };
  status: string;
  'status-timestamps': {
    'agent-queued-at'?: string;
    'started-at'?: string;
    'finished-at'?: string;
  };
  'log-read-url': string;
  'resource-additions'?: number;
  'resource-changes'?: number;
  'resource-destructions'?: number;
  'resource-imports'?: number;
  'structured-run-output-enabled': boolean;
}

export interface ApplyRelationships {
  'state-versions'?: {
    data: ResourceRef[];
  };
}

export type ApplyResource = ResourceObject<ApplyAttributes> & {
  relationships?: ApplyRelationships;
};

export type ApplyResponse = SingleResponse<ApplyResource>;
export type ApplyListResponse = ListResponse<ApplyResource>;

export interface Apply {
  id: string;
  mode?: string;
  status: string;
  queuedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  logReadUrl: string;
  resourceAdditions?: number;
  resourceChanges?: number;
  resourceDestructions?: number;
  resourceImports?: number;
  stateVersionIds: string[];
  structuredRunOutputEnabled: boolean;
}

export interface ApplyFilter extends WhereClause<Apply> {
  _and?: ApplyFilter[];
  _or?: ApplyFilter[];
  _not?: ApplyFilter;

  id?: StringComparisonExp;
  mode?: StringComparisonExp;
  structuredRunOutputEnabled?: BooleanComparisonExp;
  status?: StringComparisonExp;
  queuedAt?: DateTimeComparisonExp;
  startedAt?: DateTimeComparisonExp;
  finishedAt?: DateTimeComparisonExp;
  logReadUrl?: StringComparisonExp;
  resourceAdditions?: IntComparisonExp;
  resourceChanges?: IntComparisonExp;
  resourceDestructions?: IntComparisonExp;
  resourceImports?: IntComparisonExp;
  stateVersionIds?: StringComparisonExp;
}
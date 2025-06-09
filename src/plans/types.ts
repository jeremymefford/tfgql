import {
  WhereClause,
  StringComparisonExp,
  IntComparisonExp,
  BooleanComparisonExp
} from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface PlanAttributes {
  'execution-details': {
    mode: string;
    'agent-id'?: string;
    'agent-name'?: string;
    'agent-pool-id'?: string;
    'agent-pool-name'?: string;
  };
  'generated-configuration': boolean;
  'has-changes': boolean;
  'resource-additions': number;
  'resource-changes': number;
  'resource-destructions': number;
  'resource-imports': number;
  status: string;
  'status-timestamps': {
    'queued-at': string;
    'pending-at': string;
    'started-at': string;
    'finished-at': string;
  };
  'log-read-url': string;
}

export interface PlanRelationships {
  'state-versions': {
    data: ResourceRef[];
  };
}

export type PlanResource = ResourceObject<PlanAttributes> & {
  relationships?: PlanRelationships;
};

export type PlanResponse = SingleResponse<PlanResource>;
export type PlanListResponse = ListResponse<PlanResource>;

export interface Plan {
  id: string;
  executionDetails: {
    mode: string;
    agentId?: string;
    agentName?: string;
    agentPoolId?: string;
    agentPoolName?: string;
  };
  generatedConfiguration: boolean;
  hasChanges: boolean;
  resourceAdditions: number;
  resourceChanges: number;
  resourceDestructions: number;
  resourceImports: number;
  status: string;
  statusTimestamps: {
    queuedAt: string;
    pendingAt: string;
    startedAt: string;
    finishedAt: string;
  };
  logReadUrl: string;
  stateVersionIds: string[];
}

export interface PlanFilter extends WhereClause<Plan> {
  _and?: PlanFilter[];
  _or?: PlanFilter[];
  _not?: PlanFilter;

  id?: StringComparisonExp;
  status?: StringComparisonExp;
  generatedConfiguration?: BooleanComparisonExp;
  hasChanges?: BooleanComparisonExp;
  resourceAdditions?: IntComparisonExp;
  resourceChanges?: IntComparisonExp;
  resourceDestructions?: IntComparisonExp;
  resourceImports?: IntComparisonExp;
}
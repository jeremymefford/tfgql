import { BooleanComparisonExp, DateTimeComparisonExp, IntComparisonExp, StringComparisonExp, WhereClause } from '../common/filtering/types';
import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface StateVersionAttributes {
  'created-at': string;
  size?: number;
  'hosted-json-state-download-url'?: string;
  'hosted-state-download-url'?: string;
  'hosted-json-state-upload-url'?: string;
  'hosted-state-upload-url'?: string;
  status?: string;
  intermediate?: boolean;
  modules?: Record<string, any>;
  providers?: Record<string, any>;
  resources?: any[];
  'resources-processed'?: boolean;
  serial?: number;
  'state-version'?: number;
  'terraform-version'?: string;
  'vcs-commit-sha'?: string;
  'vcs-commit-url'?: string;
}

export interface StateVersionRelationships {
  run?: { data: ResourceRef };
  'created-by'?: { data: ResourceRef };
  workspace?: { data: ResourceRef };
  outputs?: { data: ResourceRef[] };
}

export type StateVersionResource = ResourceObject<StateVersionAttributes> & { relationships?: StateVersionRelationships };
export type StateVersionListResponse = ListResponse<StateVersionResource>;
export type StateVersionResponse = SingleResponse<StateVersionResource>;

/**
 * Domain model for a state version.
 */
export interface StateVersion {
  id: string;
  createdAt: string;
  size?: number;
  hostedJsonStateDownloadUrl?: string;
  hostedStateDownloadUrl?: string;
  hostedJsonStateUploadUrl?: string;
  hostedStateUploadUrl?: string;
  status?: string;
  intermediate?: boolean;
  modules?: Record<string, any>;
  providers?: Record<string, any>;
  resources?: any[];
  resourcesProcessed?: boolean;
  serial?: number;
  stateVersion?: number;
  terraformVersion?: string;
  vcsCommitSha?: string;
  vcsCommitUrl?: string;
  run?: ResourceRef;
  createdBy?: ResourceRef;
  workspace?: ResourceRef;
}

export interface StateVersionFilter extends WhereClause<StateVersion> {
  _and?: StateVersionFilter[];
  _or?: StateVersionFilter[];
  _not?: StateVersionFilter;

  id?: StringComparisonExp;
  status?: StringComparisonExp;
  intermediate?: BooleanComparisonExp;
  serial?: IntComparisonExp;
  stateVersion?: IntComparisonExp;
}
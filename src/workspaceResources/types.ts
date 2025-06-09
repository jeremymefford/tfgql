import { ResourceObject, ListResponse } from '../common/types/jsonApi';
import { StringComparisonExp, DateTimeComparisonExp } from '../common/filtering/types';

export interface WorkspaceResourceAttributes {
  address: string;
  name: string;
  "created-at": string;
  "updated-at": string;
  module: string;
  provider: string;
  "provider-type": string;
  "modified-by-state-version-id": string;
  "name-index": string | null;
}

export type WorkspaceResourceResource = ResourceObject<WorkspaceResourceAttributes>;
export type WorkspaceResourceListResponse = ListResponse<WorkspaceResourceResource>;

export interface WorkspaceResource {
  id: string;
  address: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  module: string | null;
  provider: string;
  providerType: string;
  modifiedByStateVersionId: string;
  nameIndex: string | null;
  workspaceId: string | undefined;
}

export interface WorkspaceResourceFilter {
  _and?: WorkspaceResourceFilter[];
  _or?: WorkspaceResourceFilter[];
  _not?: WorkspaceResourceFilter;

  id?: StringComparisonExp;
  address?: StringComparisonExp;
  name?: StringComparisonExp;
  module?: StringComparisonExp;
  provider?: StringComparisonExp;
  providerType?: StringComparisonExp;
  modifiedByStateVersionId?: StringComparisonExp;
  nameIndex?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  updatedAt?: DateTimeComparisonExp;
}
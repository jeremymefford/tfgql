import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface RunAttributes {
  status: string;
  'created-at': string;
  'is-destroy': boolean;
  message?: string;
}

export interface RunRelationships {
  workspace?: {
    data: ResourceRef;
  };
}

export type RunResource = ResourceObject<RunAttributes> & { relationships?: RunRelationships };
export type RunListResponse = ListResponse<RunResource>;
export type RunResponse = SingleResponse<RunResource>;

/** Domain model for Run (matches GraphQL type fields) */
export interface Run {
  id: string;
  status: string;
  message?: string;
  isDestroy: boolean;
  createdAt: string;
  /** ID of the workspace this run belongs to (for linking) */
  workspaceId?: string;
}
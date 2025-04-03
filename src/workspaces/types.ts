import { ResourceObject, ListResponse, SingleResponse, ResourceRef } from '../common/types/jsonApi';

export interface WorkspaceAttributes {
  name: string;
  description?: string;
  locked?: boolean;
  'auto-apply'?: boolean;
  'created-at'?: string;
}

export interface WorkspaceRelationships {
  organization?: {
    data: ResourceRef;
  };
}

export type WorkspaceResource = ResourceObject<WorkspaceAttributes> & { relationships?: WorkspaceRelationships };
export type WorkspaceListResponse = ListResponse<WorkspaceResource>;
export type WorkspaceResponse = SingleResponse<WorkspaceResource>;

/** Domain model for Workspace (matches GraphQL type fields) */
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  locked?: boolean;
  autoApply?: boolean;
  createdAt?: string;
  /** Name of the organization this workspace belongs to (for linking) */
  organizationName?: string;
}
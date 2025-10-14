import { ResourceObject, ListResponse, ResourceRef } from "../common/types/jsonApi";

export interface AdminUserAttributes {
  username: string;
  email?: string;
  "avatar-url"?: string;
  "is-admin": boolean;
  "is-suspended": boolean;
  "is-service-account": boolean;
}

export interface AdminUserRelationships {
  organizations?: {
    data: ResourceRef[];
  };
}

export type AdminUserResource = ResourceObject<AdminUserAttributes> & {
  relationships?: AdminUserRelationships;
};

export type AdminUsersListResponse = ListResponse<AdminUserResource>;

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  isServiceAccount: boolean;
  isAdmin: boolean;
  isSuspended: boolean;
  organizationIds: string[];
}

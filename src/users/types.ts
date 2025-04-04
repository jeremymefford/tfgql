import { ResourceObject, ListResponse, SingleResponse } from '../common/types/jsonApi';

export interface UserAttributes {
  username: string;
  email: string;
  'avatar-url'?: string;
  'is-service-account': boolean;
  'auth-method': string;
  'v2-only': boolean;
  permissions: {
    'can-create-organizations': boolean;
    'can-change-email': boolean;
    'can-change-username': boolean;
  };
}

export type UserResource = ResourceObject<UserAttributes>;
export type UserListResponse = ListResponse<UserResource>;
export type UserResponse = SingleResponse<UserResource>;

/** Domain model for User (matches GraphQL type fields) */
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  isServiceAccount: boolean;
  authMethod: string;
  v2Only: boolean;
  permissions: {
    canCreateOrganizations: boolean;
    canChangeEmail: boolean;
    canChangeUsername: boolean;
  };
}
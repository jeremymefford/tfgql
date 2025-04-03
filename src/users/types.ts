import { ResourceObject, ListResponse, SingleResponse } from '../common/types/jsonApi';

export interface UserAttributes {
  username: string;
  email: string;
  'avatar-url'?: string;
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
}
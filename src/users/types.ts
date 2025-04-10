import { ResourceObject, ListResponse, SingleResponse } from '../common/types/jsonApi';
import {
  StringComparisonExp,
  BooleanComparisonExp
} from '../common/filtering/types';

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
export type UserResponse = SingleResponse<UserResource>;

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

export interface UserFilter {
  _and?: UserFilter[];
  _or?: UserFilter[];
  _not?: UserFilter;

  id?: StringComparisonExp;
  username?: StringComparisonExp;
  email?: StringComparisonExp;
  avatarUrl?: StringComparisonExp;
  isServiceAccount?: BooleanComparisonExp;
  authMethod?: StringComparisonExp;
  v2Only?: BooleanComparisonExp;
}
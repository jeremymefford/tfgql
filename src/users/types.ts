import { ResourceObject, SingleResponse } from "../common/types/jsonApi";
import {
  StringComparisonExp,
  BooleanComparisonExp,
  WhereClause,
} from "../common/filtering/types";

export interface UserAttributes {
  username: string;
  email: string;
  "avatar-url"?: string;
  "is-service-account": boolean;
  "auth-method": string;
  "v2-only": boolean;
  permissions: {
    "can-create-organizations": boolean;
    "can-view-settings": boolean;
    "can-view-profile": boolean;
    "can-change-email": boolean;
    "can-change-username": boolean;
    "can-change-password": boolean;
    "can-manage-sessions": boolean;
    "can-manage-sso-identities": boolean;
    "can-manage-user-tokens": boolean;
    "can-update-user": boolean;
    "can-reenable-2fa-by-unlinking": boolean;
    "can-manage-hcp-account": boolean;
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
    canViewSettings: boolean;
    canViewProfile: boolean;
    canChangeEmail: boolean;
    canChangeUsername: boolean;
    canChangePassword: boolean;
    canManageSessions: boolean;
    canManageSsoIdentities: boolean;
    canManageUserTokens: boolean;
    canUpdateUser: boolean;
    canReenable2faByUnlinking: boolean;
    canManageHcpAccount: boolean;
  };
}

export interface UserPermissionsFilter
  extends WhereClause<User["permissions"]> {
  _and?: UserPermissionsFilter[];
  _or?: UserPermissionsFilter[];
  _not?: UserPermissionsFilter;

  canCreateOrganizations?: BooleanComparisonExp;
  canViewSettings?: BooleanComparisonExp;
  canViewProfile?: BooleanComparisonExp;
  canChangeEmail?: BooleanComparisonExp;
  canChangeUsername?: BooleanComparisonExp;
  canChangePassword?: BooleanComparisonExp;
  canManageSessions?: BooleanComparisonExp;
  canManageSsoIdentities?: BooleanComparisonExp;
  canManageUserTokens?: BooleanComparisonExp;
  canUpdateUser?: BooleanComparisonExp;
  canReenable2faByUnlinking?: BooleanComparisonExp;
  canManageHcpAccount?: BooleanComparisonExp;
}

export interface UserFilter
  extends WhereClause<User, { permissions: UserPermissionsFilter }> {
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
  permissions?: UserPermissionsFilter;
}

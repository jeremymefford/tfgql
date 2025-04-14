import { DomainMapper } from "../common/middleware/domainMapper";
import { User, UserResource } from "./types";

export const userMapper: DomainMapper<UserResource, User> = {
  map(user: UserResource): User {
    return {
      id: user.id,
      username: user.attributes.username,
      email: user.attributes.email,
      avatarUrl: user.attributes['avatar-url'],
      isServiceAccount: user.attributes['is-service-account'],
      authMethod: user.attributes['auth-method'],
      v2Only: user.attributes['v2-only'],
      permissions: {
        canCreateOrganizations: user.attributes.permissions?.['can-create-organizations'] ?? false,
        canViewSettings: user.attributes.permissions?.['can-view-settings'] ?? false,
        canViewProfile: user.attributes.permissions?.['can-view-profile'] ?? false,
        canChangeEmail: user.attributes.permissions?.['can-change-email'] ?? false,
        canChangeUsername: user.attributes.permissions?.['can-change-username'] ?? false,
        canChangePassword: user.attributes.permissions?.['can-change-password'] ?? false,
        canManageSessions: user.attributes.permissions?.['can-manage-sessions'] ?? false,
        canManageSsoIdentities: user.attributes.permissions?.['can-manage-sso-identities'] ?? false,
        canManageUserTokens: user.attributes.permissions?.['can-manage-user-tokens'] ?? false,
        canUpdateUser: user.attributes.permissions?.['can-update-user'] ?? false,
        canReenable2faByUnlinking: user.attributes.permissions?.['can-reenable-2fa-by-unlinking'] ?? false,
        canManageHcpAccount: user.attributes.permissions?.['can-manage-hcp-account'] ?? false
      }
    };
  }
};
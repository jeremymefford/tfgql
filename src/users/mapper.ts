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
        canChangeEmail: user.attributes.permissions?.['can-change-email'] ?? false,
        canChangeUsername: user.attributes.permissions?.['can-change-username'] ?? false
      }
    };
  }
};
import { DomainMapper } from "../common/middleware/domainMapper";
import { AdminUser, AdminUserResource } from "./types";

export const adminUserMapper: DomainMapper<AdminUserResource, AdminUser> = {
  map(resource: AdminUserResource): AdminUser {
    const organizations =
      resource.relationships?.organizations?.data?.map(({ id }) => id) ?? [];

    return {
      id: resource.id,
      username: resource.attributes.username,
      email: resource.attributes.email,
      avatarUrl: resource.attributes["avatar-url"],
      isServiceAccount: resource.attributes["is-service-account"],
      isAdmin: resource.attributes["is-admin"],
      isSuspended: resource.attributes["is-suspended"],
      organizationIds: organizations,
    };
  },
};

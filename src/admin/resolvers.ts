import { Context } from "../server/context";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import type { Organization } from "../organizations/types";
import type { AdminUser } from "./types";
import type { UserFilter } from "../users/types";
import type { Team, TeamFilter } from "../teams/types";
import { loadTeamsForUser } from "../users/resolvers";

export const resolvers = {
  Query: {
    adminUsers: async (
      _: unknown,
      args: {
        filter?: UserFilter;
        search?: string;
        admin?: boolean;
        suspended?: boolean;
      },
      ctx: Context,
    ): Promise<AdminUser[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.adminAPI.listUsers({
          filter: args.filter,
          search: args.search,
          admin: args.admin,
          suspended: args.suspended,
        }),
      );
    },
  },
  AdminUser: {
    organizations: async (
      user: AdminUser,
      _: unknown,
      ctx: Context,
    ): Promise<Organization[]> => {
      if (user.organizationIds.length === 0) {
        return [];
      }

      const organizations = await Promise.all(
        user.organizationIds.map((id) =>
          ctx.dataSources.organizationsAPI.getOrganization(id),
        )
      ).then((results) => results.filter((res) => res !== null));

      return organizations;
    },
    teams: async (
      user: AdminUser,
      { includeOrgs, excludeOrgs, filter }: { includeOrgs: string[]; excludeOrgs: string[]; filter?: TeamFilter },
      ctx: Context,
    ): Promise<Team[]> => {
      return loadTeamsForUser(ctx, user.id, includeOrgs, excludeOrgs, filter);
    },
  },
};

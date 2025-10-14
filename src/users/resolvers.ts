import { Context } from "../server/context";
import { User } from "./types";
import type { Team, TeamFilter } from "../teams/types";
import { loadTeamsForUser } from "../common/userTeams";

export const resolvers = {
  Query: {
    user: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ): Promise<User | null> => {
      const userResource = await ctx.dataSources.usersAPI.getUser(id);
      return userResource;
    },
    me: async (_: unknown, __: unknown, ctx: Context): Promise<User> => {
      const userResource = await ctx.dataSources.usersAPI.getCurrentUser();
      return userResource;
    },
  },
  UserAccount: {
    __resolveType(obj: unknown) {
      if (obj && typeof obj === "object") {
        const record = obj as Record<string, unknown>;
        if ("permissions" in record || "authMethod" in record) {
          return "User";
        }
        if ("isAdmin" in record || "isSuspended" in record) {
          return "AdminUser";
        }
      }
      return null;
    },
  },
  User: {
    teams: async (
      user: User,
      { filter }: { filter?: TeamFilter },
      ctx: Context,
    ): Promise<Team[]> => {
      return loadTeamsForUser(ctx, user.id, filter);
    },
  },
};

import { Context } from "../server/context";
import { User } from "./types";
import type { Team, TeamFilter } from "../teams/types";
import { coalesceOrgs } from "../common/orgHelper";
import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";

export async function loadTeamsForUser(
  ctx: Context,
  userId: string,
  includeOrgs: string[],
  excludeOrgs: string[],
  filter: TeamFilter | undefined,
): Promise<Team[]> {
  const teams: Team[] = [];
  const orgsToGather = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
  await parallelizeBounded(orgsToGather, async (orgId) => {
    for await (const teamPage of ctx.dataSources.teamsAPI.listTeams(
      orgId,
      filter,
    )) {
      for (const team of teamPage) {
        if (team.userIds && team.userIds.includes(userId)) {
          teams.push(team);
        }
      }
    }
  });
  return teams;
}

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
      {
        includeOrgs,
        excludeOrgs,
        filter,
      }: { includeOrgs: string[]; excludeOrgs: string[]; filter?: TeamFilter },
      ctx: Context,
    ): Promise<Team[]> => {
      return loadTeamsForUser(ctx, user.id, includeOrgs, excludeOrgs, filter);
    },
  },
};

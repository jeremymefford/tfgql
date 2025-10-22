import { Context } from "../server/context";
import { Team, TeamFilter } from "./types";
import { fetchResources } from "../common/fetchResources";
import { User, UserFilter } from "../users/types";
import { TeamToken, TeamTokenFilter } from "../teamTokens/types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { coalesceOrgs } from "../common/orgHelper";
import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";
import { AdminUser } from "../admin/types";
import { resolvers as workspaceTeamAccessResolvers } from "../workspaceTeamAccess/resolvers";
import { WorkspaceTeamAccess, WorkspaceTeamAccessFilter } from "../workspaceTeamAccess/types";

export const resolvers = {
  Query: {
    teams: async (
      _: unknown,
      {
        includeOrgs,
        excludeOrgs,
        filter,
      }: {
        includeOrgs?: string[];
        excludeOrgs?: string[];
        filter?: TeamFilter;
      },
      ctx: Context,
    ): Promise<Team[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      const results: Team[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        await gatherAsyncGeneratorPromises(
          ctx.dataSources.teamsAPI.listTeams(orgId, filter),
        ).then((teams) => {
          results.push(...teams);
        });
      });
      return results;
    },
    teamsByName: async (
      _: unknown,
      {
        organization,
        names,
        filter,
      }: { organization: string; names: string[]; filter?: TeamFilter },
      ctx: Context,
    ): Promise<Team[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.teamsAPI.listTeamsByName(
          organization,
          new Set(names),
          filter,
        ),
      );
    },
    teamsByQuery: async (
      _: unknown,
      {
        organization,
        query,
        filter,
      }: { organization: string; query: string; filter?: TeamFilter },
      ctx: Context,
    ): Promise<Team[]> => {
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.teamsAPI.listTeamsByQuery(organization, query, filter),
      );
    },
    team: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ): Promise<Team | null> => {
      const team = await ctx.dataSources.teamsAPI.getTeam(id);
      return team;
    },
  },
  Team: {
    users: async (
      team: Team,
      { filter }: { filter?: UserFilter },
      ctx: Context,
    ): Promise<User[]> => {
      return fetchResources<string, User, UserFilter>(
        team.userIds,
        (id) => ctx.dataSources.usersAPI.getUser(id),
        filter,
      );
    },
    organization: async (team: Team, _: unknown, ctx: Context) => {
      const organization =
        await ctx.dataSources.organizationsAPI.getOrganization(
          team.organizationId,
        );
      return organization;
    },
    tokens: async (
      team: Team,
      { filter }: { filter?: TeamTokenFilter },
      ctx: Context,
    ): Promise<TeamToken[]> =>
      gatherAsyncGeneratorPromises(
        ctx.dataSources.teamTokensAPI.listTeamTokens(team.id, filter),
      ),
    usersFromAdmin: async (
      team: Team,
      { filter }: { filter?: UserFilter },
      ctx: Context,
    ): Promise<AdminUser[]> =>
      ctx.dataSources.adminAPI.listUsers({
        filter: filter,
        organizationId: team.organizationId,
      }),
    workspaceAccess: async (
      team: Team,
      { filter }: { filter?: WorkspaceTeamAccessFilter },
      ctx: Context
    ): Promise<WorkspaceTeamAccess[]> => {
      return workspaceTeamAccessResolvers.Query.workspaceTeamAccessByTeam(
        null,
        { teamId: team.id, filter },
        ctx,
      );
    }
  },
};

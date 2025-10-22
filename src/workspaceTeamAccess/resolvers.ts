import { parallelizeBounded } from "../common/concurrency/parallelizeBounded";
import { Context } from "../server/context";
import { WorkspaceTeamAccess, WorkspaceTeamAccessFilter } from "./types";

export const resolvers = {
  Query: {
    workspaceTeamAccessByWorkspace: async (
      _: unknown,
      {
        workspaceId,
        filter,
      }: { workspaceId: string; filter?: WorkspaceTeamAccessFilter },
      ctx: Context,
    ): Promise<WorkspaceTeamAccess[]> =>
      ctx.dataSources.workspaceTeamAccessAPI.listTeamAccessForWorkspace(
        workspaceId,
        filter,
      ),

    workspaceTeamAccessByTeam: async (
      _: unknown,
      {
        teamId,
        filter,
      }: { teamId: string; filter?: WorkspaceTeamAccessFilter },
      ctx: Context,
    ): Promise<WorkspaceTeamAccess[]> => {
      const team = await ctx.dataSources.teamsAPI.getTeam(teamId);
      if (!team) {
        return [];
      }
      const org = team.organizationId;
      const result: WorkspaceTeamAccess[] = [];
      for await (const page of ctx.dataSources.workspacesAPI.listWorkspaces(
        org,
      )) {
        await parallelizeBounded(page, async (workspace) => {
          const workspaceTeamAccess =
            await ctx.dataSources.workspaceTeamAccessAPI.listTeamAccessForWorkspace(
              workspace.id,
              filter,
            );
          const teamAccess = workspaceTeamAccess.filter(
            (access) => access.teamId === teamId,
          );
          if (teamAccess.length > 0) {
            result.push(...teamAccess);
          }
        });
      }
      return result;
    },
    workspaceTeamAccessById: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ): Promise<WorkspaceTeamAccess | null> =>
      ctx.dataSources.workspaceTeamAccessAPI.getTeamWorkspaceAccess(id),
  },
  WorkspaceTeamAccess: {
    team: async (access: WorkspaceTeamAccess, _: unknown, ctx: Context) =>
      ctx.dataSources.teamsAPI.getTeam(access.teamId),
    workspace: async (access: WorkspaceTeamAccess, _: unknown, ctx: Context) =>
      ctx.dataSources.workspacesAPI.getWorkspace(access.workspaceId),
  },
};

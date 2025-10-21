import { Context } from "../server/context";
import {
  WorkspaceTeamAccess,
  WorkspaceTeamAccessFilter,
} from "./types";

export const resolvers = {
  Query: {
    workspaceTeamAccessByWorkspace: async (
      _: unknown,
      { workspaceId, filter }: { workspaceId: string; filter?: WorkspaceTeamAccessFilter },
      ctx: Context,
    ): Promise<WorkspaceTeamAccess[]> =>
      ctx.dataSources.workspaceTeamAccessAPI.listTeamAccessForWorkspace(workspaceId, filter),

    workspaceTeamAccessByTeam: async (
      _: unknown,
      { teamId, filter }: { teamId: string; filter?: WorkspaceTeamAccessFilter },
      ctx: Context,
    ): Promise<WorkspaceTeamAccess[]> =>
      ctx.dataSources.workspaceTeamAccessAPI.listTeamAccessForTeam(teamId, filter),

    workspaceTeamAccessById: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ): Promise<WorkspaceTeamAccess | null> =>
      ctx.dataSources.workspaceTeamAccessAPI.getTeamWorkspaceAccess(id),
  },
  WorkspaceTeamAccess: {
    team: async (
      access: WorkspaceTeamAccess,
      _: unknown,
      ctx: Context,
    ) => ctx.dataSources.teamsAPI.getTeam(access.teamId),
    workspace: async (
      access: WorkspaceTeamAccess,
      _: unknown,
      ctx: Context,
    ) => ctx.dataSources.workspacesAPI.getWorkspace(access.workspaceId),
  },
};

import { Context } from "../server/context";
import { Workspace, WorkspaceFilter } from "../workspaces/types";

export const resolvers = {
  Query: {
    teamWorkspaces: async (
      _: unknown,
      {
        teamId: _teamId,
        filter: _filter,
      }: { teamId: string; filter?: WorkspaceFilter },
      { dataSources: _dataSources }: Context,
    ): Promise<Workspace[]> => {
      return [];
      // return gatherAsyncGeneratorPromises(
      //   return []; // TODO fix later
      //   // dataSources.teamAccessAPI.listWorkspacesForTeam(teamId, filter)
      // );
    },
  },
};

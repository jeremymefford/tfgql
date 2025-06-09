import { Context } from '../server/context';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { Workspace, WorkspaceFilter } from '../workspaces/types';

export const resolvers = {
  Query: {
    teamWorkspaces: async (
      _: unknown,
      { teamId, filter }: { teamId: string; filter?: WorkspaceFilter },
      { dataSources }: Context
    ): Promise<Promise<Workspace>[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.teamAccessAPI.listWorkspacesForTeam(teamId, filter)
      );
    }
  }
};
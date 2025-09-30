import { Context } from '../server/context';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { Workspace, WorkspaceFilter } from '../workspaces/types';

export const resolvers = {
  Query: {
    teamWorkspaces: async (
      _: unknown,
      { teamId, filter }: { teamId: string; filter?: WorkspaceFilter },
      { dataSources }: Context
    ): Promise<Workspace[]> => {
      return [];
      // return gatherAsyncGeneratorPromises(
      //   return []; // TODO fix later
      //   // dataSources.teamAccessAPI.listWorkspacesForTeam(teamId, filter)
      // );
    }
  }
};
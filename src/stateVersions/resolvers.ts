import { Context } from '../server/context';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { StateVersion, StateVersionFilter } from './types';

export const resolvers = {
  Query: {
    stateVersions: async (
      _: unknown,
      { orgName, workspaceName, filter }: { orgName: string; workspaceName: string; filter?: StateVersionFilter },
      { dataSources }: Context
    ): Promise<Promise<StateVersion>[]> =>
      gatherAsyncGeneratorPromises(
        dataSources.stateVersionsAPI.listStateVersions(orgName, workspaceName, filter)
      ),

    stateVersion: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<StateVersion | null> => {
      return dataSources.stateVersionsAPI.getStateVersion(id);
    },

    workspaceCurrentStateVersion: async (
      _: unknown,
      { workspaceId }: { workspaceId: string },
      { dataSources }: Context
    ): Promise<StateVersion | null> => {
      return dataSources.stateVersionsAPI.getCurrentStateVersion(workspaceId);
    }
  }
};
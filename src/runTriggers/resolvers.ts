import { Context } from '../server/context';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { RunTrigger, RunTriggerFilter } from './types';

export const resolvers = {
  Query: {
    runTriggers: async (
      _: unknown,
      { workspaceId, filter }: { workspaceId: string; filter?: RunTriggerFilter },
      { dataSources }: Context
    ): Promise<Promise<RunTrigger>[]> =>
      gatherAsyncGeneratorPromises(
        dataSources.runTriggersAPI.listRunTriggers(workspaceId, filter)
      ),

    runTrigger: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<RunTrigger | null> => {
      return dataSources.runTriggersAPI.getRunTrigger(id);
    }
  },
  RunTrigger: {
    workspace: (rt: RunTrigger, _: unknown, { dataSources }: Context) =>
      rt.workspace ? dataSources.workspacesAPI.getWorkspace(rt.workspace.id) : null,
    sourceable: (rt: RunTrigger, _: unknown, { dataSources }: Context) =>
      rt.sourceable ? dataSources.workspacesAPI.getWorkspace(rt.sourceable.id) : null
  }
};
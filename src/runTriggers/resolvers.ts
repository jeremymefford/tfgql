import { Context } from '../server/context';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { RunTrigger, RunTriggerFilter } from './types';
import { Workspace } from '../workspaces/types';

export const resolvers = {
  Query: {
    runTriggers: async (
      _: unknown,
      { workspaceId, filter }: { workspaceId: string; filter?: RunTriggerFilter },
      ctx: Context
    ): Promise<Promise<RunTrigger>[]> =>
      gatherAsyncGeneratorPromises(
        ctx.dataSources.runTriggersAPI.listRunTriggers(workspaceId, filter)
      ),

    runTrigger: async (_: unknown, { id }: { id: string }, ctx: Context): Promise<RunTrigger | null> => {
      return ctx.dataSources.runTriggersAPI.getRunTrigger(id);
    }
  },

  RunTrigger: {
    workspace: async (rt: RunTrigger & { workspaceId?: string }, _: unknown, ctx: Context): Promise<Workspace | null> => {
      const id = (rt as any).workspaceId ?? rt.workspace?.id ?? null;
      return id ? ctx.dataSources.workspacesAPI.getWorkspace(id) : null;
    },
    sourceable: async (rt: RunTrigger & { sourceableId?: string }, _: unknown, ctx: Context): Promise<Workspace | null> => {
      const id = (rt as any).sourceableId ?? rt.sourceable?.id ?? null;
      return id ? ctx.dataSources.workspacesAPI.getWorkspace(id) : null;
    }
  }
};

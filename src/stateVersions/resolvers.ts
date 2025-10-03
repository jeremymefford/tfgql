import { Context } from '../server/context';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { StateVersion, StateVersionFilter } from './types';
import { Run } from '../runs/types';
import { User } from '../users/types';
import { StateVersionOutput } from '../stateVersionOutputs/types';
import { Workspace } from '../workspaces/types';

export const resolvers = {
  Query: {
    stateVersions: async (
      _: unknown,
      { orgName, workspaceName, filter }: { orgName: string; workspaceName: string; filter?: StateVersionFilter },
      ctx: Context
    ): Promise<Promise<StateVersion>[]> => {
      ctx.logger.info({ orgName, workspaceName }, 'Listing state versions');
      return gatherAsyncGeneratorPromises(
        ctx.dataSources.stateVersionsAPI.listStateVersions(orgName, workspaceName, filter)
      );
    },

    stateVersion: async (_: unknown, { id }: { id: string }, ctx: Context): Promise<StateVersion | null> => {
      return ctx.dataSources.stateVersionsAPI.getStateVersion(id);
    },

    workspaceCurrentStateVersion: async (
      _: unknown,
      { workspaceId }: { workspaceId: string },
      ctx: Context
    ): Promise<StateVersion | null> => {
      return ctx.dataSources.stateVersionsAPI.getCurrentStateVersion(workspaceId);
    }
  },
  StateVersion: {
    run: async (sv: StateVersion, _: unknown, ctx: Context): Promise<Run | null> => {
      const id = sv.run?.id ?? null;
      return id ? ctx.dataSources.runsAPI.getRun(id) : null;
    },
    createdBy: async (sv: StateVersion, _: unknown, ctx: Context): Promise<User | null> => {
      const id = sv.createdBy?.id ?? null;
      return id ? ctx.dataSources.usersAPI.getUser(id) : null;
    },
    workspace: async (sv: StateVersion, _: unknown, ctx: Context): Promise<Workspace | null> => {
      const id = sv.workspace?.id ?? null;
      return id ? ctx.dataSources.workspacesAPI.getWorkspace(id) : null;
    },
    outputs: async (sv: StateVersion, _: unknown, ctx: Context): Promise<Promise<StateVersionOutput>[]> =>
      gatherAsyncGeneratorPromises(ctx.dataSources.stateVersionOutputsAPI.listStateVersionOutputs(sv.id))
  }
};

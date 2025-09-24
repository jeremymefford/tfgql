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
  },
  StateVersion: {
    run: async (sv: StateVersion, _: unknown, { dataSources }: Context): Promise<Run | null> => {
      const id = sv.run?.id ?? null;
      return id ? dataSources.runsAPI.getRun(id) : null;
    },
    createdBy: async (sv: StateVersion, _: unknown, { dataSources }: Context): Promise<User | null> => {
      const id = sv.createdBy?.id ?? null;
      return id ? dataSources.usersAPI.getUser(id) : null;
    },
    workspace: async (sv: StateVersion, _: unknown, { dataSources }: Context): Promise<Workspace | null> => {
      const id = sv.workspace?.id ?? null;
      return id ? dataSources.workspacesAPI.getWorkspace(id) : null;
    },
    outputs: async (sv: StateVersion, _: unknown, { dataSources }: Context): Promise<Promise<StateVersionOutput>[]> =>
      gatherAsyncGeneratorPromises(dataSources.stateVersionOutputsAPI.listStateVersionOutputs(sv.id))
  }
};
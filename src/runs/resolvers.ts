import { Context } from '../server/context';
import { Run } from './types';
import { Workspace } from '../workspaces/types';

export const resolvers = {
  Query: {
    runs: async (_: unknown, { workspaceId }: { workspaceId: string }, { dataSources }: Context): Promise<Run[]> => {
      const runResources = await dataSources.runsAPI.listRuns(workspaceId);
      return runResources.map(run => ({
        id: run.id,
        status: run.attributes.status,
        message: run.attributes.message,
        isDestroy: run.attributes['is-destroy'],
        createdAt: run.attributes['created-at'],
        workspaceId: run.relationships?.workspace?.data?.id
      }));
    },
    run: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Run | null> => {
      const runResource = await dataSources.runsAPI.getRun(id);
      if (!runResource) return null;
      return {
        id: runResource.id,
        status: runResource.attributes.status,
        message: runResource.attributes.message,
        isDestroy: runResource.attributes['is-destroy'],
        createdAt: runResource.attributes['created-at'],
        workspaceId: runResource.relationships?.workspace?.data?.id
      };
    }
  },
  Mutation: {
    createRun: async (_: unknown, { workspaceId, message, isDestroy, configVersionId }: { workspaceId: string; message?: string; isDestroy?: boolean; configVersionId?: string }, { dataSources }: Context): Promise<Run> => {
      const runResource = await dataSources.runsAPI.createRun(workspaceId, message, isDestroy, configVersionId);
      return {
        id: runResource.id,
        status: runResource.attributes.status,
        message: runResource.attributes.message,
        isDestroy: runResource.attributes['is-destroy'],
        createdAt: runResource.attributes['created-at'],
        workspaceId: runResource.relationships?.workspace?.data?.id
      };
    }
  },
  Run: {
    workspace: async (run: Run, _: unknown, { dataSources }: Context): Promise<Workspace | null> => {
      const workspaceId = run.workspaceId;
      if (!workspaceId) return null;
      const wsResource = await dataSources.workspacesAPI.getWorkspace(workspaceId);
      return {
        id: wsResource.id,
        name: wsResource.attributes.name,
        description: wsResource.attributes.description,
        locked: wsResource.attributes.locked,
        autoApply: wsResource.attributes['auto-apply'],
        createdAt: wsResource.attributes['created-at'],
        organizationName: wsResource.relationships?.organization?.data?.id
      };
    }
  }
};
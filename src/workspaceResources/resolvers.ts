import { Context } from '../server/context';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { WorkspaceResource, WorkspaceResourceFilter } from './types';
import { StateVersion } from '../stateVersions/types';
import { Workspace } from '../workspaces/types';

export const resolvers = {
    Query: {
        workspaceResources: async (_: unknown, { workspaceId, filter }: { workspaceId: string, filter?: WorkspaceResourceFilter }, ctx: Context): Promise<WorkspaceResource[]> => {
            return gatherAsyncGeneratorPromises(
                ctx.dataSources.workspaceResourcesAPI.getResourcesByWorkspaceId(workspaceId, filter));
        }
    },
    WorkspaceResource: {
        workspace: async (workspaceResource: WorkspaceResource, _: unknown, ctx: Context): Promise<Workspace | null> => {
            if (!workspaceResource.workspaceId) {
                return null;
            }
            return await ctx.dataSources.workspacesAPI.getWorkspace(workspaceResource.workspaceId);
        },
        modifiedByStateVersion: async (workspaceResource: WorkspaceResource, _: unknown, ctx: Context): Promise<StateVersion | null> => {
            if (!workspaceResource.modifiedByStateVersionId) {
                return null;
            }
            return ctx.dataSources.stateVersionsAPI.getStateVersion(workspaceResource.modifiedByStateVersionId);
        }
    }
};

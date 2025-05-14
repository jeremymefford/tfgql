import { Context } from '../server/context';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { Workspace } from '../workspaces/types';
import { WorkspaceResource, WorkspaceResourceFilter } from './types';

export const resolvers = {
    Query: {
        workspaceResources: async (_: unknown, { workspaceId, filter }: { workspaceId: string, filter?: WorkspaceResourceFilter }, { dataSources }: Context): Promise<Promise<WorkspaceResource>[]> => {
            return gatherAsyncGeneratorPromises(
                dataSources.workspaceResourcesAPI.getResourcesByWorkspaceId(workspaceId, filter));
        }
    },
    WorkspaceResource: {
        workspace: async (workspaceResource: WorkspaceResource, _: unknown, { dataSources }: Context) => {
            if (!workspaceResource.workspaceId) {
                return null;
            }
            return await dataSources.workspacesAPI.getWorkspace(workspaceResource.workspaceId);
        }
    },
    Workspace: {
        workspaceResources: async (workspace: Workspace, {filter}: {filter?: WorkspaceResourceFilter}, { dataSources }: Context): Promise<Promise<WorkspaceResource>[]> => {
            return gatherAsyncGeneratorPromises(dataSources.workspaceResourcesAPI.getResourcesByWorkspaceId(workspace.id, filter));
        }
    }
};

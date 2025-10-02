import { Context } from '../server/context';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { WorkspaceResource, WorkspaceResourceFilter } from './types';
import { StateVersion } from '../stateVersions/types';
import { Workspace } from '../workspaces/types';

export const resolvers = {
    Query: {
        workspaceResources: async (_: unknown, { workspaceId, filter }: { workspaceId: string, filter?: WorkspaceResourceFilter }, { dataSources }: Context): Promise<Promise<WorkspaceResource>[]> => {
            return gatherAsyncGeneratorPromises(
                dataSources.workspaceResourcesAPI.getResourcesByWorkspaceId(workspaceId, filter));
        }
    },
    WorkspaceResource: {
        workspace: async (workspaceResource: WorkspaceResource, _: unknown, { dataSources }: Context): Promise<Workspace | null> => {
            if (!workspaceResource.workspaceId) {
                return null;
            }
            return await dataSources.workspacesAPI.getWorkspace(workspaceResource.workspaceId);
        },
        modifiedByStateVersion: async (workspaceResource: WorkspaceResource, _: unknown, { dataSources }: Context): Promise<StateVersion | null> => {
            if (!workspaceResource.modifiedByStateVersionId) {
                return null;
            }
            return dataSources.stateVersionsAPI.getStateVersion(workspaceResource.modifiedByStateVersionId);
        }
    }
};

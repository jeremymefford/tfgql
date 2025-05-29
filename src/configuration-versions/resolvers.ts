import { Context } from '../server/context';
import { ConfigurationVersion } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { applicationConfiguration, Config } from '../common/conf';
import { parallelizeBounded } from '../common/concurrency/parallelizeBounded';
import { Workspace } from '../workspaces/types';

export const resolvers = {
    Query: {
        configurationVersion: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<ConfigurationVersion> => {
            const cv = await dataSources.configurationVersionsAPI.getConfigurationVersion(id);
            return cv;
        },
        configurationVersions: async (
            _: unknown,
            { workspaceId }: { workspaceId: string },
            { dataSources }: Context
        ): Promise<ConfigurationVersion[]> => {
            return dataSources.configurationVersionsAPI.listConfigurationVersions(workspaceId);
        },
        workspacesWithConfigurationVersionsLargerThan: async (
            _: unknown,
            { organizationName, bytes }: { organizationName: string, bytes: number },
            { dataSources }: Context
        ): Promise<Workspace[]> => {
            const workspacesWithLargeCVs: Workspace[] = [];
            const batchSize = applicationConfiguration.graphqlBatchSize / 2; // divide by 2 to account for nested calls
            for await (const workspacePage of dataSources.workspacesAPI.listWorkspaces(organizationName)) {
                await parallelizeBounded(workspacePage, batchSize, async (workspace: Workspace) => {
                    const cvs = await dataSources.configurationVersionsAPI.listConfigurationVersions(workspace.id);
                    await parallelizeBounded(cvs, batchSize, async (cv: ConfigurationVersion) => {
                        const size = await resolvers.ConfigurationVersion.size(cv, {}, { dataSources } as Context);
                        if (size && size > bytes) {
                            workspacesWithLargeCVs.push(workspace);
                        }
                    });
                });
            }
            return workspacesWithLargeCVs;
        }
    },
    ConfigurationVersion: {
        size: async (cv: ConfigurationVersion, _: unknown, { dataSources }: Context): Promise<number | null> => {
            if (!cv.id) return null;
            if (!cv.downloadUrl) return null;
            const size = await dataSources.configurationVersionsAPI.getConfigurationVersionSize(cv.downloadUrl);
            return size;
        }
    }
};

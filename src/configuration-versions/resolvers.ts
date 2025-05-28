import { Context } from '../server/context';
import { ConfigurationVersion } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { Config } from '../common/conf';

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
        ): Promise<Promise<ConfigurationVersion>[]> => {
            return gatherAsyncGeneratorPromises(
                dataSources.configurationVersionsAPI.listConfigurationVersions(workspaceId)
            );
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

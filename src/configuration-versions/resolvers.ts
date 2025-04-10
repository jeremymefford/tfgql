import { Context } from '../server/context';
import { ConfigurationVersion } from './types';

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
            const cvs = await dataSources.configurationVersionsAPI.listConfigurationVersions(workspaceId);
            return cvs;
        }
    }
};

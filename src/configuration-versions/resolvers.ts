import { Context } from '../server/context';
import { ConfigurationVersion } from './types';

export function mapConfigurationVersionResourceToDomain(resource: any): ConfigurationVersion {
    return {
        id: resource.id,
        autoQueueRuns: resource.attributes['auto-queue-runs'],
        error: resource.attributes.error,
        errorMessage: resource.attributes['error-message'],
        provisional: resource.attributes.provisional,
        source: resource.attributes.source,
        speculative: resource.attributes.speculative,
        status: resource.attributes.status,
        statusTimestamps: {
            archivedAt: resource.attributes['status-timestamps']?.['archived-at'],
            fetchingAt: resource.attributes['status-timestamps']?.['fetching-at'],
            uploadedAt: resource.attributes['status-timestamps']?.['uploaded-at']
        },
        changedFiles: resource.attributes['changed-files'],
        ingressAttributesId: resource.relationships?.['ingress-attributes']?.data?.id
    };
}

export const resolvers = {
    Query: {
        configurationVersion: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<ConfigurationVersion> => {
            const resource = await dataSources.configurationVersionsAPI.getConfigurationVersion(id);
            return mapConfigurationVersionResourceToDomain(resource);
        },
        configurationVersionsForWorkspace: async (
            _: unknown,
            { workspaceId }: { workspaceId: string },
            { dataSources }: Context
        ): Promise<ConfigurationVersion[]> => {
            const resources = await dataSources.configurationVersionsAPI.listConfigurationVersions(workspaceId);
            return resources.map(mapConfigurationVersionResourceToDomain);
        }
    }
};

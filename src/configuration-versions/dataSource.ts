import { fetchAllPages } from '../common/fetchAllPages';
import { axiosClient } from '../common/httpClient';
import { configurationVersionMapper } from './mapper';
import { ConfigurationVersionResponse, ConfigurationVersion } from './types';

export class ConfigurationVersionsAPI {
    async getConfigurationVersion(id: string): Promise<ConfigurationVersion> {
        const res = await axiosClient.get<ConfigurationVersionResponse>(`/configuration-versions/${id}`);
        if (!res || !res.data || !res.data.data) {
            throw new Error(`Failed to fetch run data for configuration version ID: ${id}`);
        }
        return configurationVersionMapper.map(res.data.data);
    }

    async listConfigurationVersions(workspaceId: string): Promise<ConfigurationVersion[]> {
        console.log("fetching configuration versions for workspace", workspaceId);
        return fetchAllPages<ConfigurationVersion>(
            `/workspaces/${workspaceId}/configuration-versions`,
            configurationVersionMapper);
    }
}

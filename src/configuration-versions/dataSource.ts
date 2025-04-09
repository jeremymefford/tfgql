import { axiosClient } from '../common/httpClient';
import { ConfigurationVersionResponse, ConfigurationVersionResource } from './types';

export class ConfigurationVersionsAPI {
  async getConfigurationVersion(id: string): Promise<ConfigurationVersionResource> {
    const res = await axiosClient.get<ConfigurationVersionResponse>(`/configuration-versions/${id}`);
    return res.data.data;
  }

  async listConfigurationVersions(workspaceId: string): Promise<ConfigurationVersionResource[]> {
    const res = await axiosClient.get(`/workspaces/${workspaceId}/configuration-versions`);
    return res.data.data;
  }
}

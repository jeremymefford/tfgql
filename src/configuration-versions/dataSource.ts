import { streamPages } from '../common/streamPages';
import { axiosClient } from '../common/httpClient';
import { configurationVersionMapper } from './mapper';
import { ConfigurationVersionResponse, ConfigurationVersion, ConfigurationVersionFilter } from './types';

export class ConfigurationVersionsAPI {

    async getConfigurationVersion(id: string): Promise<ConfigurationVersion> {
        const res = await axiosClient.get<ConfigurationVersionResponse>(`/configuration-versions/${id}`);
        if (!res || !res.data || !res.data.data) {
            throw new Error(`Failed to fetch run data for configuration version ID: ${id}`);
        }
        return configurationVersionMapper.map(res.data.data);
    }

async getConfigurationVersionSize(downloadUrl: string): Promise<number | null> {
    if (!downloadUrl) return null;

    try {
        const headResponse = await axiosClient.head(downloadUrl);
        const contentLengthHeader = headResponse.headers['content-length'];
        const contentLength = parseInt(contentLengthHeader, 10);

        if (!isNaN(contentLength) && contentLength > 0) {
            return contentLength;
        }

        // Fallback: Stream and count manually
        const getResponse = await axiosClient.get(downloadUrl, { responseType: 'stream' });
        let totalBytes = 0;

        return await new Promise<number>((resolve, reject) => {
            getResponse.data.on('data', (chunk: Buffer) => {
                totalBytes += chunk.length;
            });
            getResponse.data.on('end', () => resolve(totalBytes));
            getResponse.data.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to fetch size for download URL: ${downloadUrl}`, error);
        return null;
    }
}

    async *listConfigurationVersions(
        workspaceId: string,
        filter?: ConfigurationVersionFilter
    ): AsyncGenerator<ConfigurationVersion[]> {
        yield* streamPages<ConfigurationVersion, ConfigurationVersionFilter>(
            `/workspaces/${workspaceId}/configuration-versions`,
            configurationVersionMapper,
            {},
            filter
        );
    }
}

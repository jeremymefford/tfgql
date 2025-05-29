import { gatherAsyncGeneratorPromises, streamPages } from '../common/streamPages';
import { axiosClient } from '../common/httpClient';
import { configurationVersionMapper } from './mapper';
import { ConfigurationVersionResponse, ConfigurationVersion, ConfigurationVersionFilter } from './types';
import { RequestCache } from '../common/requestCache';
import stringify from 'json-stable-stringify';

export class ConfigurationVersionsAPI {
    private requestCache: RequestCache;

    constructor(requestCache: RequestCache) {
        this.requestCache = requestCache;
    }

    async getConfigurationVersion(id: string): Promise<ConfigurationVersion> {
        return await this.requestCache.getOrSet<ConfigurationVersion>(
            'ConfigurationVersion',
            id,
            async () => {
                const res = await axiosClient.get<ConfigurationVersionResponse>(
                    `/configuration-versions/${id}`, {
                        params: { 'include': 'run' } // currently doesn't work, but should according to the API docs
                    });
                if (!res || !res.data || !res.data.data) {
                    throw new Error(`Failed to fetch run data for configuration version ID: ${id}`);
                }
                return configurationVersionMapper.map(res.data.data);
            }
        );

    }

    async getConfigurationVersionSize(downloadUrl: string): Promise<number | null> {
        return this.requestCache.getOrSet<number | null>('ConfigurationVersion', downloadUrl, async () => {
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
        });
    }

    async listConfigurationVersions(
        workspaceId: string,
        filter?: ConfigurationVersionFilter
    ): Promise<ConfigurationVersion[]> {
        const cacheKey = `${workspaceId}:${stringify(filter ?? {})}`;
        return this.requestCache.getOrSet<ConfigurationVersion[]>(
            'ConfigurationVersions',
            cacheKey,
            async () => {
                const configVersions: ConfigurationVersion[] = [];
                const generator = streamPages<ConfigurationVersion, ConfigurationVersionFilter>(
                    `/workspaces/${workspaceId}/configuration-versions`,
                    configurationVersionMapper,
                    { "include": "run" }, // currently doesn't work, but should according to the API docs
                    filter
                );
                for await (const batch of generator) {
                    configVersions.push(...batch);
                }
                return configVersions;
            });
    }
}

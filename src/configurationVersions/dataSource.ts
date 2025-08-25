import { gatherAsyncGeneratorPromises, streamPages } from '../common/streamPages';
import { axiosClient } from '../common/httpClient';
import { configurationVersionMapper } from './mapper';
import { ConfigurationVersionResponse, ConfigurationVersion, ConfigurationVersionFilter, IngressAttributes, /*IngressAttributesResponse*/ } from './types';
import { RequestCache } from '../common/requestCache';
import stringify from 'json-stable-stringify';

export class ConfigurationVersionsAPI {
    private requestCache: RequestCache;

    constructor(requestCache: RequestCache) {
        this.requestCache = requestCache;
    }

    async getConfigurationVersion(id: string): Promise<ConfigurationVersion | null> {
        return this.requestCache.getOrSet<ConfigurationVersion | null>(
            'ConfigurationVersion',
            id,
            async () => {
                return axiosClient.get<ConfigurationVersionResponse>(
                    `/configuration-versions/${id}`, {
                    params: { 'include': 'run' } // currently doesn't work, but should according to the API docs
                })
                    .then(res => configurationVersionMapper.map(res.data.data))
                    .catch(err => {
                        if (err.status === 404) {
                            return null;
                        }
                        throw err;
                    });
            }
        );
    }

    async getConfigurationVersionSize(downloadUrl: string): Promise<number | null> {
        return this.requestCache.getOrSet<number | null>('ConfigurationVersion', downloadUrl, async () => {
            if (!downloadUrl) return null;

            const baseOpts = {
                maxRedirects: 5,
                timeout: 360_000,
                decompress: false as const,
                headers: { 'Accept-Encoding': 'identity' },
                validateStatus: (s: number) => s >= 200 && s < 400,
            } as const;

            const parseTotal = (headers: Record<string, string | number | undefined>): number | null => {
                const len = headers['content-length'];
                if (len !== undefined) {
                    const n = Number(len);
                    if (Number.isFinite(n) && n >= 0) return n;
                }
                const cr = headers['content-range']; 
                if (typeof cr === 'string') {
                    const m = /\/(\d+)$/.exec(cr);
                    if (m) {
                        const n = Number(m[1]);
                        if (Number.isFinite(n) && n >= 0) return n;
                    }
                }
                return null;
            };

            try {
                const head = await axiosClient.head(downloadUrl, baseOpts);
                const n = parseTotal(head.headers as any);
                if (n !== null) return n;
            } catch { /* continue */ }

            try {
                const rangeResp = await axiosClient.get(downloadUrl, {
                    ...baseOpts,
                    headers: { ...baseOpts.headers, Range: 'bytes=0-0' },
                    responseType: 'stream',
                });
                const n = parseTotal(rangeResp.headers as any);
                rangeResp.data.destroy?.();
                if (n !== null) return n;
            } catch (e: any) {
                if (e?.response?.status === 416) return 0; // empty file
            }

            const controller = new AbortController();
            const HARD_TIMEOUT_MS = 300_000;
            const IDLE_TIMEOUT_MS = 30_000; 
            let idleTimer: NodeJS.Timeout | null = null;
            const resetIdle = () => {
                if (idleTimer) clearTimeout(idleTimer);
                idleTimer = setTimeout(() => controller.abort(), IDLE_TIMEOUT_MS);
            };
            const hardTimer = setTimeout(() => controller.abort(), HARD_TIMEOUT_MS);

            try {
                const resp = await axiosClient.get(downloadUrl, {
                    ...baseOpts,
                    responseType: 'stream',
                    signal: controller.signal as any,
                });

                let total = 0;
                resetIdle();
                for await (const chunk of resp.data as AsyncIterable<Buffer>) {
                    total += (chunk as Buffer).length;
                    resetIdle();
                }
                return total;
            } catch {
                return null;
            } finally {
                if (idleTimer) clearTimeout(idleTimer);
                clearTimeout(hardTimer);
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

    /**
     * Fetch VCS commit metadata for a given configuration version.
     */
    async getIngressAttributes(configurationVersionId: string): Promise<IngressAttributes> {
        const res = await axiosClient.get<{ data: any }>(
            `/configuration-versions/${configurationVersionId}/ingress-attributes`
        );
        return {
            id: res.data.data.id,
            branch: res.data.data.attributes.branch,
            cloneUrl: res.data.data.attributes['clone-url'],
            commitMessage: res.data.data.attributes['commit-message'],
            commitSha: res.data.data.attributes['commit-sha'],
            commitUrl: res.data.data.attributes['commit-url'],
            compareUrl: res.data.data.attributes['compare-url'],
            identifier: res.data.data.attributes.identifier,
            isPullRequest: res.data.data.attributes['is-pull-request'],
            onDefaultBranch: res.data.data.attributes['on-default-branch'],
            pullRequestNumber: res.data.data.attributes['pull-request-number'],
            pullRequestUrl: res.data.data.attributes['pull-request-url'],
            pullRequestTitle: res.data.data.attributes['pull-request-title'],
            pullRequestBody: res.data.data.attributes['pull-request-body'],
            tag: res.data.data.attributes.tag,
            senderUsername: res.data.data.attributes['sender-username'],
            senderAvatarUrl: res.data.data.attributes['sender-avatar-url'],
            senderHtmlUrl: res.data.data.attributes['sender-html-url'],
            createdBy: res.data.data.relationships?.['created-by']?.data?.id
        };
    }
}

import { Context } from '../server/context';
import { ConfigurationVersion, IngressAttributes } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { applicationConfiguration, Config } from '../common/conf';
import { parallelizeBounded } from '../common/concurrency/parallelizeBounded';
import { Workspace } from '../workspaces/types';

export const resolvers = {
    Query: {
        configurationVersion: async (_: unknown, { id }: { id: string }, ctx: Context): Promise<ConfigurationVersion | null> => {
            const cv = await ctx.dataSources.configurationVersionsAPI.getConfigurationVersion(id);
            return cv;
        },
        configurationVersions: async (
            _: unknown,
            { workspaceId }: { workspaceId: string },
            ctx: Context
        ): Promise<ConfigurationVersion[]> => {
            return ctx.dataSources.configurationVersionsAPI.listConfigurationVersions(workspaceId);
        },
        workspacesWithConfigurationVersionsLargerThan: async (
            _: unknown,
            { organizationName, bytes }: { organizationName: string, bytes: number },
            ctx: Context
        ): Promise<Workspace[]> => {
            const workspacesWithLargeCVs: Workspace[] = [];
            for await (const workspacePage of ctx.dataSources.workspacesAPI.listWorkspaces(organizationName)) {
                await parallelizeBounded(workspacePage, async (workspace: Workspace) => {
                    const cvs = await ctx.dataSources.configurationVersionsAPI.listConfigurationVersions(workspace.id);
                    await parallelizeBounded(cvs, async (cv: ConfigurationVersion) => {
                        const size = await resolvers.ConfigurationVersion.size(cv, {}, ctx);
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
        size: async (cv: ConfigurationVersion, _: unknown, ctx: Context): Promise<number | null> => {
            if (!cv.id || !cv.downloadUrl) return null;
            return ctx.dataSources.configurationVersionsAPI.getConfigurationVersionSize(cv.downloadUrl);
        },
        ingressAttributes: async (
            cv: ConfigurationVersion,
            _: unknown,
            ctx: Context
        ): Promise<IngressAttributes | null> => {
            if (!cv.ingressAttributesId) return null;
            return ctx.dataSources.configurationVersionsAPI.getIngressAttributes(cv.id);
        }
    }
};

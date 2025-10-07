import { Context } from '../server/context';
import { Workspace, WorkspaceFilter } from './types';
import { Organization } from '../organizations/types';
import { Run, RunFilter } from '../runs/types';
import { ConfigurationVersion, ConfigurationVersionFilter } from '../configurationVersions/types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { Variable, VariableFilter } from '../variables/types';
import { parallelizeBounded } from '../common/concurrency/parallelizeBounded';
import { RunTrigger, WorkspaceRunTrigger } from '../runTriggers/types';
import { StateVersion, StateVersionFilter } from '../stateVersions/types';
import { WorkspaceResourceFilter, WorkspaceResource } from '../workspaceResources/types';
import { coalesceOrgs } from '../common/orgHelper';

export const resolvers = {
  Query: {
    workspaces: async (
      _: unknown,
      { includeOrgs, excludeOrgs, filter }: { includeOrgs?: string[]; excludeOrgs?: string[]; filter?: WorkspaceFilter },
      ctx: Context
    ): Promise<Workspace[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }

      const results: Workspace[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        const workspaces = await gatherAsyncGeneratorPromises(
          ctx.dataSources.workspacesAPI.listWorkspaces(orgId, filter)
        );
        results.push(...workspaces);
      });
      return results;
    },
    workspaceByName: async (
      _: unknown,
      { organization, workspaceName }: { organization: string; workspaceName: string },
      ctx: Context
    ): Promise<Workspace | null> => {
      const workspace = await ctx.dataSources.workspacesAPI.getWorkspaceByName(organization, workspaceName);
      if (!workspace) return null;
      return workspace;
    },
    workspace: async (_: unknown, { id }: { id: string }, ctx: Context): Promise<Workspace | null> => {
      const workspace = await ctx.dataSources.workspacesAPI.getWorkspace(id);
      if (!workspace) return null;
      return workspace;
    },
    workspacesWithNoResources: async (
      _: unknown,
      { includeOrgs, excludeOrgs, filter }: { includeOrgs?: string[]; excludeOrgs?: string[]; filter?: WorkspaceFilter },
      ctx: Context
    ): Promise<Workspace[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }

      const matches: Workspace[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        ctx.logger.info({ orgName: orgId }, 'Finding workspaces with no resources');
        const workspaceGenerator = ctx.dataSources.workspacesAPI.listWorkspaces(orgId, filter);
        const localMatches: Workspace[] = [];
        for await (const workspacePage of workspaceGenerator) {
          await parallelizeBounded(workspacePage, async (workspace: Workspace) => {
            const resourcesGenerator = ctx.dataSources.workspaceResourcesAPI.getResourcesByWorkspaceId(
              workspace.id,
              undefined,
              1
            );
            const resources = await resourcesGenerator.next();
            if (!resources.value || resources.value.length === 0) {
              localMatches.push(workspace);
            }
            resourcesGenerator.return(undefined);
          });
        }
        ctx.logger.info({ orgName: orgId, count: localMatches.length }, 'Found workspaces with no resources');
        matches.push(...localMatches);
      });
      return matches;
    },
    workspacesWithOpenRuns: async (
      _: unknown,
      {
        includeOrgs,
        excludeOrgs,
        filter,
        runFilter
      }: {
        includeOrgs?: string[];
        excludeOrgs?: string[];
        filter?: WorkspaceFilter;
        runFilter: RunFilter;
      },
      ctx: Context
    ): Promise<Workspace[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }

      const result: Workspace[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        ctx.logger.info({ orgName: orgId }, 'Finding workspaces with open runs');
        const localMatches: Workspace[] = [];
        for await (const page of ctx.dataSources.workspacesAPI.listWorkspaces(orgId, filter)) {
          await parallelizeBounded(page, async (workspace: Workspace) => {
            const runsIterator = ctx.dataSources.runsAPI.listRuns(workspace.id, runFilter);
            const { value: runs } = await runsIterator.next();
            if (runs && runs.length > 0) {
              localMatches.push(workspace);
            }
            runsIterator.return(undefined);
          });
        }
        ctx.logger.info({ orgName: orgId, count: localMatches.length }, 'Found workspaces with open runs');
        result.push(...localMatches);
      });
      return result;
    }
    ,
    stackGraph: async (
      _: unknown,
      { includeOrgs, excludeOrgs }: { includeOrgs?: string[]; excludeOrgs?: string[] },
      ctx: Context
    ): Promise<WorkspaceRunTrigger[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      if (orgs.length === 0) {
        return [];
      }

      const edges: WorkspaceRunTrigger[] = [];
      await parallelizeBounded(orgs, async (orgId) => {
        ctx.logger.info({ orgName: orgId }, 'Building workspace stack graph');
        const localEdges: WorkspaceRunTrigger[] = [];
        for await (const page of ctx.dataSources.workspacesAPI.listWorkspaces(orgId)) {
          await parallelizeBounded(page, async (workspace: Workspace) => {
            for await (const triggers of ctx.dataSources.runTriggersAPI.listRunTriggers(workspace.id)) {
              localEdges.push(...triggers);
            }
          });
        }
        ctx.logger.info({ orgName: orgId, edgeCount: localEdges.length }, 'Workspace stack graph complete');
        edges.push(...localEdges);
      });
      return edges;
    }
  },
  Workspace: {
    organization: async (workspace: Workspace, _: unknown, ctx: Context): Promise<Organization | null> => {
      const orgName = workspace.organizationName;
      if (!orgName) return null;
      const organization = await ctx.dataSources.organizationsAPI.getOrganization(orgName);
      return organization
    },
    runs: async (workspace: Workspace, { filter }: { filter?: RunFilter }, ctx: Context): Promise<Run[]> => {
      return gatherAsyncGeneratorPromises(ctx.dataSources.runsAPI.listRuns(workspace.id, filter));
    },
    workspaceResources: async (workspace: Workspace, { filter }: { filter?: WorkspaceResourceFilter }, ctx: Context): Promise<WorkspaceResource[]> => {
      return gatherAsyncGeneratorPromises(ctx.dataSources.workspaceResourcesAPI.getResourcesByWorkspaceId(workspace.id, filter));
    },
    configurationVersions: async (workspace: Workspace, { filter }: { filter?: ConfigurationVersionFilter }, ctx: Context): Promise<ConfigurationVersion[]> => {
      return ctx.dataSources.configurationVersionsAPI.listConfigurationVersions(workspace.id, filter);
    },
    variables: async (workspace: Workspace, { filter }: { filter?: VariableFilter }, ctx: Context): Promise<Variable[]> => {
      ctx.logger.info({ workspaceId: workspace.id }, 'Fetching variables for workspace');
      return ctx.dataSources.variablesAPI.getVariablesForWorkspace(workspace.id, filter);
    },
    stateVersions: async (workspace: Workspace, { filter }: { filter?: StateVersionFilter }, ctx: Context): Promise<StateVersion[]> => {
      if (!workspace.organizationName) {
        throw new Error(`Workspace ${workspace.id} does not have an organizationName set, cannot fetch state versions.`);
      }
      return gatherAsyncGeneratorPromises(ctx.dataSources.stateVersionsAPI.listStateVersions(workspace.organizationName, workspace.id, filter));
    },
    currentStateVersion: async (workspace: Workspace, _: unknown, ctx: Context): Promise<StateVersion | null> => {
      return await ctx.dataSources.stateVersionsAPI.getCurrentStateVersion(workspace.id)
        .catch(async (error) => {
          if (error.response && error.response.status === 404) {
            return null;
          } else {
            throw error;
          }
        });
    }
  }
};

import { Context } from '../server/context';
import { Workspace, WorkspaceFilter } from './types';
import { Organization } from '../organizations/types';
import { Run, RunFilter } from '../runs/types';
import { ConfigurationVersion, ConfigurationVersionFilter } from '../configurationVersions/types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { Variable, VariableFilter } from '../variables/types';
import { applicationConfiguration } from '../common/conf';
import { parallelizeBounded } from '../common/concurrency/parallelizeBounded';
import { RunTrigger, WorkspaceRunTrigger } from '../runTriggers/types';
import { StateVersion, StateVersionFilter } from '../stateVersions/types';
import { AxiosError } from 'axios';
import { WorkspaceResourceFilter, WorkspaceResource } from '../workspaceResources/types';

export const resolvers = {
  Query: {
    workspaces: (_: unknown, { orgName, filter }: { orgName: string, filter?: WorkspaceFilter }, ctx: Context): Promise<Promise<Workspace>[]> => {
      return gatherAsyncGeneratorPromises(ctx.dataSources.workspacesAPI.listWorkspaces(orgName, filter));
    },
    workspaceByName: async (_: unknown, { orgName, workspaceName }: { orgName: string, workspaceName: string }, ctx: Context): Promise<Workspace | null> => {
      const workspace = await ctx.dataSources.workspacesAPI.getWorkspaceByName(orgName, workspaceName);
      if (!workspace) return null;
      return workspace;
    },
    workspace: async (_: unknown, { id }: { id: string }, ctx: Context): Promise<Workspace | null> => {
      const workspace = await ctx.dataSources.workspacesAPI.getWorkspace(id);
      if (!workspace) return null;
      return workspace;
    },
    workspacesWithNoResources: async (_: unknown, { orgName, filter }: { orgName: string, filter?: WorkspaceFilter }, ctx: Context): Promise<Workspace[]> => {
      ctx.logger.info({ orgName }, 'Finding workspaces with no resources');
      const workspaceGenerator = ctx.dataSources.workspacesAPI.listWorkspaces(orgName, filter);
      const workspacesWithNoResources: Workspace[] = [];
      for await (const workspacePage of workspaceGenerator) {
        await parallelizeBounded(workspacePage, async (workspace: Workspace) => {
          const resourcesGenerator = ctx.dataSources.workspaceResourcesAPI.getResourcesByWorkspaceId(workspace.id, undefined, 1);
          const resources = await resourcesGenerator.next();
          if (!resources.value || resources.value.length === 0) {
            workspacesWithNoResources.push(workspace);
          }
          resourcesGenerator.return(undefined);
        });
      }
      ctx.logger.info({ orgName, count: workspacesWithNoResources.length }, 'Found workspaces with no resources');
      return workspacesWithNoResources;
    },
    workspacesWithOpenRuns: async (
      _: unknown,
      { orgName, filter, runFilter }: { orgName: string; filter?: WorkspaceFilter; runFilter: RunFilter },
      ctx: Context
    ): Promise<Workspace[]> => {
      ctx.logger.info({ orgName }, 'Finding workspaces with open runs');
      const result: Workspace[] = [];
      for await (const page of ctx.dataSources.workspacesAPI.listWorkspaces(orgName, filter)) {
        await parallelizeBounded(page, async (workspace: Workspace) => {
          const runsIterator = ctx.dataSources.runsAPI.listRuns(workspace.id, runFilter);
          const { value: runs } = await runsIterator.next();
          if (runs && runs.length > 0) {
            result.push(workspace);
          }
          runsIterator.return(undefined);
        });
      }
      ctx.logger.info({ orgName, count: result.length }, 'Found workspaces with open runs');
      return result;
    }
    ,
    stackGraph: async (
      _: unknown,
      { orgName }: { orgName: string },
      ctx: Context
    ): Promise<WorkspaceRunTrigger[]> => {
      ctx.logger.info({ orgName }, 'Building workspace stack graph');
      const edges: WorkspaceRunTrigger[] = [];
      for await (const page of ctx.dataSources.workspacesAPI.listWorkspaces(orgName)) {
        await parallelizeBounded(page, async (workspace: Workspace) => {
          for await (const triggers of ctx.dataSources.runTriggersAPI.listRunTriggers(workspace.id)) {
            edges.push(...triggers);
          }
        });
      }
      ctx.logger.info({ orgName, edgeCount: edges.length }, 'Workspace stack graph complete');
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
    runs: async (workspace: Workspace, { filter }: { filter?: RunFilter }, ctx: Context): Promise<Promise<Run>[]> => {
      return gatherAsyncGeneratorPromises(ctx.dataSources.runsAPI.listRuns(workspace.id, filter));
    },
    workspaceResources: async (workspace: Workspace, { filter }: { filter?: WorkspaceResourceFilter }, ctx: Context): Promise<Promise<WorkspaceResource>[]> => {
      return gatherAsyncGeneratorPromises(ctx.dataSources.workspaceResourcesAPI.getResourcesByWorkspaceId(workspace.id, filter));
    },
    configurationVersions: async (workspace: Workspace, { filter }: { filter?: ConfigurationVersionFilter }, ctx: Context): Promise<ConfigurationVersion[]> => {
      return ctx.dataSources.configurationVersionsAPI.listConfigurationVersions(workspace.id, filter);
    },
    variables: async (workspace: Workspace, { filter }: { filter?: VariableFilter }, ctx: Context): Promise<Variable[]> => {
      ctx.logger.info({ workspaceId: workspace.id }, 'Fetching variables for workspace');
      return ctx.dataSources.variablesAPI.getVariablesForWorkspace(workspace.id, filter);
    },
    stateVersions: async (workspace: Workspace, { filter }: { filter?: StateVersionFilter }, ctx: Context): Promise<Promise<StateVersion>[]> => {
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

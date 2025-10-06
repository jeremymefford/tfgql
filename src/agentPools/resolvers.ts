import { Context } from '../server/context';
import { AgentPool, AgentPoolFilter } from './types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';
import { fetchResources } from '../common/fetchResources';
import { Workspace, WorkspaceFilter } from '../workspaces/types';
import { Agent, AgentFilter } from '../agents/types';
import { AgentToken, AgentTokenFilter } from '../agentTokens/types';

export const resolvers = {
  Query: {
    agentPools: async (
      _: unknown,
      { orgName, filter }: { orgName: string; filter?: AgentPoolFilter },
      { dataSources }: Context
    ): Promise<AgentPool[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.agentPoolsAPI.listAgentPools(orgName, filter)
      );
    },
    agentPool: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ): Promise<AgentPool | null> => {
      return dataSources.agentPoolsAPI.getAgentPool(id);
    }
  },
  AgentPool: {
    workspaces: async (
      pool: AgentPool,
      { filter }: { filter?: WorkspaceFilter },
      { dataSources }: Context
    ): Promise<Workspace[]> => {
      return fetchResources<string, Workspace, WorkspaceFilter>(
        pool.workspaceIds,
        id => dataSources.workspacesAPI.getWorkspace(id),
        filter
      );
    },
    allowedWorkspaces: async (
      pool: AgentPool,
      { filter }: { filter?: WorkspaceFilter },
      { dataSources }: Context
    ): Promise<Workspace[]> => {
      return fetchResources<string, Workspace, WorkspaceFilter>(
        pool.allowedWorkspaceIds,
        id => dataSources.workspacesAPI.getWorkspace(id),
        filter
      );
    },
    agents: async (
      pool: AgentPool,
      { filter }: { filter?: AgentFilter },
      { dataSources }: Context
    ): Promise<Agent[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.agentPoolsAPI.listAgents(pool.id, filter)
      );
    },
    authenticationTokens: async (
      pool: AgentPool,
      { filter }: { filter?: AgentTokenFilter },
      { dataSources }: Context
    ): Promise<AgentToken[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.agentTokensAPI.listAgentTokens(pool.id, filter)
      );
    }
  }
};
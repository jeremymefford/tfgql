import type { AxiosInstance } from 'axios';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import {
  AgentPool,
  AgentPoolFilter,
  AgentPoolResponse,
} from './types';
import { agentPoolMapper } from './mapper';
import { Agent, AgentFilter } from '../agents/types';
import { agentMapper } from '../agents/mapper';

export class AgentPoolsAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *listAgentPools(
    orgName: string,
    filter?: AgentPoolFilter
  ): AsyncGenerator<AgentPool[], void, unknown> {
    yield* streamPages<AgentPool, AgentPoolFilter>(
      this.httpClient,
      `/organizations/${orgName}/agent-pools`,
      agentPoolMapper,
      undefined,
      filter
    );
  }

  async *listAgents(
    agentPoolId: string,
    filter?: AgentFilter
  ): AsyncGenerator<Agent[], void, unknown> {
    yield* streamPages<Agent, AgentFilter>(
      this.httpClient,
      `/agent-pools/${agentPoolId}/agents`,
      agentMapper,
      undefined,
      filter
    );
  }

  async getAgentPool(id: string): Promise<AgentPool | null> {
    return this.httpClient.get<AgentPoolResponse>(`/agent-pools/${id}`)
      .then((res) => agentPoolMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

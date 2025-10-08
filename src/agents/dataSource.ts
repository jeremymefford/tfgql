import type { AxiosInstance } from 'axios';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { Agent, AgentFilter, AgentResponse, AgentListResponse } from './types';
import { agentMapper } from './mapper';

export class AgentsAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *listAgents(
    poolId: string,
    filter?: AgentFilter
  ): AsyncGenerator<Agent[], void, unknown> {
    yield* streamPages<Agent, AgentFilter>(
      this.httpClient,
      `/agent-pools/${poolId}/agents`,
      agentMapper,
      undefined,
      filter
    );
  }

  async getAgent(id: string): Promise<Agent | null> {
    return this.httpClient.get<AgentResponse>(`/agents/${id}`)
      .then((res) => agentMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

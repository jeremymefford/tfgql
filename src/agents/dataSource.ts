import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { Agent, AgentFilter, AgentResponse, AgentListResponse } from './types';
import { agentMapper } from './mapper';

export class AgentsAPI {
  async *listAgents(
    poolId: string,
    filter?: AgentFilter
  ): AsyncGenerator<Agent[], void, unknown> {
    yield* streamPages<Agent, AgentFilter>(
      `/agent-pools/${poolId}/agents`,
      agentMapper,
      undefined,
      filter
    );
  }

  async getAgent(id: string): Promise<Agent | null> {
    return axiosClient.get<AgentResponse>(`/agents/${id}`)
      .then((res) => agentMapper.map(res.data.data))
      .catch((err) => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }
}
import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
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
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

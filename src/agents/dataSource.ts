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

  async getAgent(id: string): Promise<Agent> {
    const res = await axiosClient.get<AgentResponse>(`/agents/${id}`);
    return agentMapper.map(res.data.data);
  }
}
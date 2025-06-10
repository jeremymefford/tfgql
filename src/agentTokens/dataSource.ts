import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { AgentToken, AgentTokenFilter, AgentTokenResponse } from './types';
import { agentTokenMapper } from './mapper';

export class AgentTokensAPI {
  async *listAgentTokens(poolId: string, filter?: AgentTokenFilter): AsyncGenerator<AgentToken[], void, unknown> {
    yield* streamPages<AgentToken, AgentTokenFilter>(
      `/agent-pools/${poolId}/authentication-tokens`,
      agentTokenMapper,
      undefined,
      filter
    );
  }

  async getAgentToken(id: string): Promise<AgentToken> {
    const res = await axiosClient.get<AgentTokenResponse>(`/authentication-tokens/${id}`);
    return agentTokenMapper.map(res.data.data);
  }
}
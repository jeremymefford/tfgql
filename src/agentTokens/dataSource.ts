import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { AgentToken, AgentTokenFilter, AgentTokenResponse } from './types';
import { agentTokenMapper } from './mapper';

export class AgentTokensAPI {
  async *listAgentTokens(poolId: string, filter?: AgentTokenFilter): AsyncGenerator<AgentToken[], void, unknown> {
    const agentTokenStream = streamPages<AgentToken, AgentTokenFilter>(
      `/agent-pools/${poolId}/authentication-tokens`,
      agentTokenMapper,
      undefined,
      filter
    );
    for await (const agentTokenPage of agentTokenStream) {
      agentTokenPage.forEach(token => {
        token.poolId = poolId;
      });
      yield agentTokenPage;
    }
  }

  async getAgentToken(id: string): Promise<AgentToken | null> {
    return axiosClient.get<AgentTokenResponse>(`/authentication-tokens/${id}`)
      .then((res) => agentTokenMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import { AgentToken, AgentTokenFilter, AgentTokenResponse } from "./types";
import { agentTokenMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class AgentTokensAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listAgentTokens(
    poolId: string,
    filter?: AgentTokenFilter,
  ): AsyncGenerator<AgentToken[], void, unknown> {
    const agentTokenStream = streamPages<AgentToken, AgentTokenFilter>(
      this.httpClient,
      `/agent-pools/${poolId}/authentication-tokens`,
      agentTokenMapper,
      undefined,
      filter,
    );
    for await (const agentTokenPage of agentTokenStream) {
      agentTokenPage.forEach((token) => {
        token.poolId = poolId;
      });
      yield agentTokenPage;
    }
  }

  async getAgentToken(id: string): Promise<AgentToken | null> {
    return this.requestCache.getOrSet<AgentToken | null>("agentToken", id, async () =>
      this.httpClient
        .get<AgentTokenResponse>(`/authentication-tokens/${id}`)
        .then((res) => agentTokenMapper.map(res.data.data))
        .catch((err) => {
          if (isNotFound(err)) {
            return null;
          }
          throw err;
        }),
    );
  }
}

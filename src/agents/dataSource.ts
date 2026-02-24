import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import { Agent, AgentFilter, AgentResponse } from "./types";
import { agentMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class AgentsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listAgents(
    poolId: string,
    filter?: AgentFilter,
  ): AsyncGenerator<Agent[], void, unknown> {
    yield* streamPages<Agent, AgentFilter>(
      this.httpClient,
      `/agent-pools/${poolId}/agents`,
      agentMapper,
      undefined,
      filter,
    );
  }

  async getAgent(id: string): Promise<Agent | null> {
    return this.requestCache.getOrSet<Agent | null>("agent", id, async () =>
      this.httpClient
        .get<AgentResponse>(`/agents/${id}`)
        .then((res) => agentMapper.map(res.data.data))
        .catch((err) => {
          if (isNotFound(err)) {
            return null;
          }
          throw err;
        }),
    );
  }
}

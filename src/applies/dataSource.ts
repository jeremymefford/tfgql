import type { AxiosInstance } from "axios";
import { Apply, ApplyResponse } from "./types";
import { applyMapper } from "./mapper";
import { logger } from "../common/logger";
import { isNotFound } from "../common/http";
import { RequestCache } from "../common/requestCache";

export class AppliesAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) { }

  async getRunApply(runId: string): Promise<Apply | null> {
    return this.requestCache.getOrSet<Apply | null>(
      "RunApplyGET",
      runId,
      async () =>
        this.httpClient
          .get<ApplyResponse>(`/runs/${runId}/apply`)
          .then((response) => applyMapper.map(response.data.data))
          .catch((error) => {
            if (isNotFound(error)) {
              return null;
            }
            logger.error({ err: error, runId }, "Error fetching run apply");
            return null;
          }));
  }

  async getApply(id: string): Promise<Apply | null> {
    return this.requestCache.getOrSet<Apply | null>(
      "ApplyGET",
      id,
      async () =>
        this.httpClient
          .get<ApplyResponse>(`/applies/${id}`)
          .then((res) => applyMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }));
  }
}

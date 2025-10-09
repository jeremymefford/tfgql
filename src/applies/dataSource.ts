import type { AxiosInstance } from "axios";
import { Apply, ApplyResponse } from "./types";
import { applyMapper } from "./mapper";
import { logger } from "../common/logger";
import { isNotFound } from "../common/http";

export class AppliesAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async getRunApply(runId: string): Promise<Apply | null> {
    return this.httpClient
      .get<ApplyResponse>(`/runs/${runId}/apply`)
      .then((response) => {
        return applyMapper.map(response.data.data);
      })
      .catch((error) => {
        logger.error({ err: error, runId }, "Error fetching run apply");
        return null;
      });
  }

  async getApply(id: string): Promise<Apply | null> {
    return this.httpClient
      .get<ApplyResponse>(`/applies/${id}`)
      .then((res) => applyMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { RequestCache } from "../common/requestCache";
import { TaskStage, TaskStageResponse } from "./types";
import { taskStageMapper } from "./mapper";

export class TaskStagesAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async getTaskStage(taskStageId: string): Promise<TaskStage | null> {
    return this.requestCache.getOrSet<TaskStage | null>(
      "TaskStageGET",
      taskStageId,
      async () => {
        try {
          const resp = await this.httpClient.get<TaskStageResponse>(
            `/task-stages/${taskStageId}`,
          );
          return taskStageMapper.map(resp.data.data);
        } catch (error) {
          if (isNotFound(error)) {
            return null;
          }
          throw error;
        }
      },
    );
  }
}

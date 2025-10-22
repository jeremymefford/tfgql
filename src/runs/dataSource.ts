import type { AxiosInstance } from "axios";
import { streamPages } from "../common/streamPages";
import {
  RunResponse,
  Run,
  RunFilter,
  RunPermissionsFilter,
  RunActionsFilter,
  RunStatusTimestampsFilter,
  RunEvent,
} from "./types";
import { runMapper, runEventMapper } from "./mapper";
import { logger } from "../common/logger";
import { isNotFound } from "../common/http";
import { RequestCache } from "../common/requestCache";
import { StringComparisonExp } from "../common/filtering/types";

export class RunsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) { }

  private extendParams(paramObj: any, paramName: string, expression: StringComparisonExp) {
    if ("_eq" in expression && expression._eq) {
      Object.assign(paramObj, { [`filter[${paramName}]`]: expression._eq });
    } else if ("_in" in expression && expression._in) {
      Object.assign(paramObj, { [`filter[${paramName}]`]: expression._in.join(",") });
    }
  }

  /** List all runs for a given workspace */
  async *listRuns(
    workspaceId: string,
    filter?: RunFilter,
  ): AsyncGenerator<Run[], void, unknown> {
    // due to how limited the runs APIs are, we need to do some extra server side filtering if possible
    const params = { "filter[operation]": "plan_only,plan_and_apply,save_plan,refresh_only,destroy,empty_apply" };
    if (filter) {
      if ("status" in filter && filter.status) {
        this.extendParams(params, "status", filter.status);
      }
      if ("source" in filter && filter.source) {
        this.extendParams(params, "source", filter.source);
      }
    }
    logger.debug({ workspaceId }, "Fetching runs for workspace");
    yield* streamPages<
      Run,
      {
        permissions: RunPermissionsFilter;
        actions: RunActionsFilter;
        statusTimestamps: RunStatusTimestampsFilter;
      }
    >(
      this.httpClient,
      `/workspaces/${workspaceId}/runs`,
      runMapper,
      params,
      filter,
    );
  }

  async getRun(runId: string): Promise<Run | null> {
    return this.requestCache.getOrSet<Run | null>("RunGET", runId, async () =>
      this.httpClient
        .get<RunResponse>(`/runs/${runId}`)
        .then((res) => runMapper.map(res.data.data))
        .catch((err) => {
          if (isNotFound(err)) {
            return null;
          }
          throw err;
        }),
    );
  }

  async *listRunEvents(
    runId: string,
  ): AsyncGenerator<RunEvent[], void, unknown> {
    yield* streamPages<RunEvent, {}>(
      this.httpClient,
      `/runs/${runId}/run-events`,
      runEventMapper,
    );
  }
}

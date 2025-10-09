import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import { Plan, PlanFilter, PlanResponse } from "./types";
import { planMapper } from "./mapper";
import { RequestCache } from "../common/requestCache";

export class PlansAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listPlans(
    runId: string,
    filter?: PlanFilter,
  ): AsyncGenerator<Plan[], void, unknown> {
    yield* streamPages<Plan, PlanFilter>(
      this.httpClient,
      `/runs/${runId}/plan`,
      planMapper,
      undefined,
      filter,
    );
  }

  async getPlan(id: string): Promise<Plan | null> {
    return this.httpClient
      .get<PlanResponse>(`/plans/${id}`)
      .then((res) => planMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }

  async getPlanForRun(runId: string): Promise<Plan | null> {
    return this.httpClient
      .get<PlanResponse>(`/runs/${runId}/plan`)
      .then((res) => planMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }

  private async createPlanExport(
    planId: string,
    dataType = "sentinel-mock-bundle-v0",
  ) {
    type PlanExportAttributes = {
      "data-type": string;
      status?: string;
      "status-timestamps"?: Record<string, string>;
    };
    type PlanExportResource = {
      id: string;
      type: "plan-exports";
      attributes: PlanExportAttributes;
      links?: { self?: string; download?: string };
    };
    type PlanExportResponse = { data: PlanExportResource };

    const payload = {
      data: {
        type: "plan-exports",
        attributes: { "data-type": dataType },
        relationships: {
          plan: { data: { type: "plans", id: planId } },
        },
      },
    };

    const resp = await this.httpClient.post<PlanExportResponse>(
      `/plan-exports`,
      payload,
    );
    return resp.data.data;
  }

  private async getPlanExport(planExportId: string) {
    type PlanExportAttributes = {
      "data-type": string;
      status: string;
      "status-timestamps"?: Record<string, string>;
    };
    type PlanExportResource = {
      id: string;
      type: "plan-exports";
      attributes: PlanExportAttributes;
      links?: { self?: string; download?: string };
    };
    type PlanExportResponse = { data: PlanExportResource };

    const resp = await this.httpClient.get<PlanExportResponse>(
      `/plan-exports/${planExportId}`,
    );
    return resp.data.data;
  }

  private async findExistingPlanExportId(
    planId: string,
    dataType = "sentinel-mock-bundle-v0",
  ): Promise<string | null> {
    // Fetch raw plan to read relationships.exports (not mapped in domain model)
    const resp = await this.httpClient.get<PlanResponse>(`/plans/${planId}`);
    const refs = resp?.data?.data?.relationships?.exports?.data ?? [];
    for (const ref of refs) {
      if (ref.type !== "plan-exports") continue;
      try {
        const exp = await this.getPlanExport(ref.id);
        const typeMatches = exp.attributes?.["data-type"] === dataType;
        const isUsable =
          exp.attributes?.status && exp.attributes.status !== "expired";
        if (typeMatches && isUsable) return exp.id;
      } catch {
        // ignore and continue scanning
      }
    }
    return null;
  }

  private async ensurePlanExport(
    planId: string,
    dataType = "sentinel-mock-bundle-v0",
  ): Promise<string> {
    try {
      const exp = await this.createPlanExport(planId, dataType);
      return exp.id;
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 422) {
        const existing = await this.findExistingPlanExportId(planId, dataType);
        if (existing) return existing;
      }
      throw err;
    }
  }

  private async waitForPlanExportFinished(
    planExportId: string,
    pollIntervalMs = 1000,
    timeoutMs = 5 * 60 * 1000,
  ) {
    const start = Date.now();
    for (;;) {
      const exp = await this.getPlanExport(planExportId);
      const status = exp.attributes?.status;
      if (status === "finished") return exp;
      if (
        status === "errored" ||
        status === "canceled" ||
        status === "expired"
      ) {
        throw new Error(`Plan export ${planExportId} is ${status}`);
      }
      if (Date.now() - start > timeoutMs) {
        throw new Error(
          `Timed out waiting for plan export ${planExportId} to finish`,
        );
      }
      await new Promise((res) => setTimeout(res, pollIntervalMs));
    }
  }

  async getPlanExportDownloadUrl(
    planId: string,
    options?: { pollIntervalMs?: number; timeoutMs?: number },
  ): Promise<string> {
    return this.requestCache.getOrSet<string>(
      `PlanExportDownloadUrl`,
      planId,
      async () => {
        const planExportId = await this.ensurePlanExport(planId);
        const exp = await this.waitForPlanExportFinished(
          planExportId,
          options?.pollIntervalMs,
          options?.timeoutMs,
        );

        // Request the download endpoint with redirects disabled so we can grab the temporary URL
        const downloadPath = `/plan-exports/${planExportId}/download`;
        const resp = await this.httpClient.get(downloadPath, {
          maxRedirects: 0,
          validateStatus: (s) => s === 302,
        });
        const location =
          (resp.headers as any)?.location || (resp.headers as any)?.Location;
        if (location) return location as string;

        // Fallback: return the API download endpoint (without needing to dereference it here)
        const apiLink = exp.links?.download;
        return apiLink?.replace(/^\/api\/v2/, "") || downloadPath;
      },
    );
  }
}

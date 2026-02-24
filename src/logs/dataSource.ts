import type { AxiosInstance } from "axios";
import type { RequestCache } from "../common/requestCache";
import { fetchArchivistJsonLines } from "../common/http";

export class LogsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async fetchLog(
    logReadUrl: string,
    minimumLevel: string = "TRACE",
  ): Promise<Record<string, unknown>[] | null> {
    const entries = await this.requestCache.getOrSet(
      "log",
      `${logReadUrl}:${minimumLevel}`,
      () =>
        fetchArchivistJsonLines(this.httpClient, logReadUrl, { minimumLevel }),
    );
    return entries.length > 0 ? entries : null;
  }
}

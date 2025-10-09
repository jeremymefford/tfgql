import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import {
  AssessmentResult,
  AssessmentResultFilter,
  AssessmentResultResponse,
} from "./types";
import { assessmentResultMapper } from "./mapper";

export class AssessmentResultsAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *listAssessmentResults(
    workspaceId: string,
    filter?: AssessmentResultFilter,
  ): AsyncGenerator<AssessmentResult[], void, unknown> {
    yield* streamPages<AssessmentResult, AssessmentResultFilter>(
      this.httpClient,
      `/workspaces/${workspaceId}/assessment-results`,
      assessmentResultMapper,
      undefined,
      filter,
    );
  }

  async getAssessmentResult(id: string): Promise<AssessmentResult | null> {
    return this.httpClient
      .get<AssessmentResultResponse>(`/assessment-results/${id}`)
      .then((res) => assessmentResultMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

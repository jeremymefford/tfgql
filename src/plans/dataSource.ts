import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { Plan, PlanFilter, PlanResponse } from './types';
import { planMapper } from './mapper';

export class PlansAPI {
  async *listPlans(runId: string, filter?: PlanFilter): AsyncGenerator<Plan[], void, unknown> {
    yield* streamPages<Plan, PlanFilter>(
      `/runs/${runId}/plan`,
      planMapper,
      undefined,
      filter
    );
  }

  async getPlan(id: string): Promise<Plan | null> {
    return axiosClient.get<PlanResponse>(`/plans/${id}`)
      .then(res => planMapper.map(res.data.data))
      .catch(err => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }

  async getPlanJsonOutputUrl(id: string): Promise<string> {
    const res = await axiosClient.get<void>(`/plans/${id}/json-output`, {
      maxRedirects: 0,
      validateStatus: status => status === 307
    });
    const location = res.headers?.location;
    if (!location) {
      throw new Error(`Missing redirect location for JSON output of plan ${id}`);
    }
    return location;
  }
}
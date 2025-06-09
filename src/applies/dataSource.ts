import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { Apply, ApplyFilter, ApplyResponse } from './types';
import { applyMapper } from './mapper';

export class AppliesAPI {
  async *listApplies(runId: string, filter?: ApplyFilter): AsyncGenerator<Apply[], void, unknown> {
    yield* streamPages<Apply, ApplyFilter>(
      `/runs/${runId}/apply`,
      applyMapper,
      undefined,
      filter
    );
  }

  async getApply(id: string): Promise<Apply> {
    const res = await axiosClient.get<ApplyResponse>(`/applies/${id}`);
    return applyMapper.map(res.data.data);
  }
}
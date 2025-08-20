import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { Apply, ApplyFilter, ApplyResponse } from './types';
import { applyMapper } from './mapper';

export class AppliesAPI {
  async getRunApply(runId: string): Promise<Apply> {
    const res = await axiosClient.get<ApplyResponse>(`/runs/${runId}/apply`);
    return applyMapper.map(res.data.data);
  }

  async getApply(id: string): Promise<Apply> {
    const res = await axiosClient.get<ApplyResponse>(`/applies/${id}`);
    return applyMapper.map(res.data.data);
  }
}
import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { Apply, ApplyFilter, ApplyResponse } from './types';
import { applyMapper } from './mapper';

export class AppliesAPI {
  async getRunApply(runId: string): Promise<Apply | null> {
    return axiosClient.get<ApplyResponse>(`/runs/${runId}/apply`)
      .then((response) => {
        return applyMapper.map(response.data.data)
      })
      .catch((error) => {
        console.error(`Error fetching run apply for runId ${runId}:`, error);
        return null;
      });
  }

  async getApply(id: string): Promise<Apply | null> {
    return axiosClient.get<ApplyResponse>(`/applies/${id}`)
      .then((res) => applyMapper.map(res.data.data))
      .catch((err) => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }
}
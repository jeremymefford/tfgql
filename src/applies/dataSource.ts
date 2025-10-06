import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { Apply, ApplyFilter, ApplyResponse } from './types';
import { applyMapper } from './mapper';
import { logger } from '../common/logger';
import { isNotFound } from '../common/http';

export class AppliesAPI {
  async getRunApply(runId: string): Promise<Apply | null> {
    return axiosClient.get<ApplyResponse>(`/runs/${runId}/apply`)
      .then((response) => {
        return applyMapper.map(response.data.data)
      })
      .catch((error) => {
        logger.error({ err: error, runId }, 'Error fetching run apply');
        return null;
      });
  }

  async getApply(id: string): Promise<Apply | null> {
    return axiosClient.get<ApplyResponse>(`/applies/${id}`)
      .then((res) => applyMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

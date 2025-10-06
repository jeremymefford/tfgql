import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { StateVersionOutput, StateVersionOutputFilter, StateVersionOutputResponse } from './types';
import { stateVersionOutputMapper } from './mapper';

export class StateVersionOutputsAPI {
  async *listStateVersionOutputs(
    stateVersionId: string,
    filter?: StateVersionOutputFilter
  ): AsyncGenerator<StateVersionOutput[], void, unknown> {
    yield* streamPages<StateVersionOutput, StateVersionOutputFilter>(
      `/state-versions/${stateVersionId}/outputs`,
      stateVersionOutputMapper,
      undefined,
      filter
    );
  }

  async getStateVersionOutput(id: string): Promise<StateVersionOutput | null> {
    return axiosClient.get<StateVersionOutputResponse>(`/state-version-outputs/${id}`)
      .then(res => stateVersionOutputMapper.map(res.data.data))
      .catch(err => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import {
  gatherAsyncGeneratorPromises,
  streamPages,
} from "../common/streamPages";
import {
  StateVersionOutput,
  StateVersionOutputFilter,
  StateVersionOutputResponse,
} from "./types";
import { stateVersionOutputMapper } from "./mapper";

export class StateVersionOutputsAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async listStateVersionOutputs(
    stateVersionId: string,
    filter?: StateVersionOutputFilter,
  ): Promise<StateVersionOutput[]> {
    const stateVersionOutputs = await gatherAsyncGeneratorPromises(
      streamPages<StateVersionOutput, StateVersionOutputFilter>(
        this.httpClient,
        `/state-versions/${stateVersionId}/outputs`,
        stateVersionOutputMapper,
        undefined,
        filter,
      ),
    );
    stateVersionOutputs.forEach((svo) => {
      svo.stateVersionId = stateVersionId;
    });
    return stateVersionOutputs;
  }

  async getStateVersionOutput(id: string): Promise<StateVersionOutput | null> {
    return this.httpClient
      .get<StateVersionOutputResponse>(`/state-version-outputs/${id}`)
      .then((res) => stateVersionOutputMapper.map(res.data.data))
      .catch((err) => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

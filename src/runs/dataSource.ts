import { axiosClient } from '../common/httpClient';
import { RunResource, RunListResponse, RunResponse } from './types';

export class RunsAPI {
  /** List all runs for a given workspace */
  async listRuns(workspaceId: string): Promise<RunResource[]> {
    const res = await axiosClient.get<RunListResponse>(`/workspaces/${workspaceId}/runs`);
    return res.data.data;
  }

  /** Get a single run by ID */
  async getRun(runId: string): Promise<RunResource> {
    const res = await axiosClient.get<RunResponse>(`/runs/${runId}`);
    return res.data.data;
  }

  /** Create (trigger) a new run in the given workspace */
  async createRun(workspaceId: string, message?: string, isDestroy: boolean = false, configVersionId?: string): Promise<RunResource> {
    const payload: any = {
      data: {
        type: 'runs',
        attributes: {
          'is-destroy': isDestroy
        },
        relationships: {
          workspace: {
            data: { type: 'workspaces', id: workspaceId }
          }
        }
      }
    };
    if (message) {
      payload.data.attributes.message = message;
    }
    if (configVersionId) {
      payload.data.relationships['configuration-version'] = {
        data: { type: 'configuration-versions', id: configVersionId }
      };
    }
    const res = await axiosClient.post<RunResponse>('/runs', payload);
    return res.data.data;
  }
}
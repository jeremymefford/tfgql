import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { workspaceMapper } from '../workspaces/mapper';
import { Workspace, WorkspaceFilter } from '../workspaces/types';

export class TeamAccessAPI {
  async *listWorkspacesForTeam(teamId: string, filter?: WorkspaceFilter): AsyncGenerator<Workspace[], void, unknown> {
    yield* streamPages<Workspace, WorkspaceFilter>(
      `/teams/${teamId}/workspaces`,
      workspaceMapper,
      undefined,
      filter
    );
  }
}

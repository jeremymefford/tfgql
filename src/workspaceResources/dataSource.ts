import { WorkspaceResource, WorkspaceResourceFilter } from './types';
import { workspaceResourceMapper } from './mapper';
import { streamPages } from '../common/streamPages';
import { applicationConfiguration } from '../common/conf';

export class WorkspaceResourcesAPI {
    async *getResourcesByWorkspaceId(workspaceId: string, filter?: WorkspaceResourceFilter, pageSize: number = applicationConfiguration.tfcPageSize): AsyncGenerator<WorkspaceResource[]> {
        const generator = streamPages<WorkspaceResource, undefined>(
            `/workspaces/${workspaceId}/resources`,
            workspaceResourceMapper,
            {},
            filter
        );
        for await (const page of generator) {
            for (const resource of page) {
                resource.workspaceId = workspaceId;
            }
            yield page;
        }
    }
}
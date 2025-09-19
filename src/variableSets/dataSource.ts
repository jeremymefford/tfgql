import { axiosClient } from '../common/httpClient';
import {
    VariableSet,
    VariableSetFilter,
    VariableSetResponse
} from './types';
import { variableSetMapper } from './mapper';
import { streamPages } from '../common/streamPages';

export class VariableSetsAPI {
    async getVariableSet(id: string): Promise<VariableSet | null> {
        return axiosClient.get<VariableSetResponse>(`/varsets/${id}`)
            .then(res => variableSetMapper.map(res.data.data))
            .catch(err => {
                if (err.status === 404) {
                    return null;
                }
                throw err;
            });
    }

    async *listVariableSetsForOrg(orgName: string, filter?: VariableSetFilter): AsyncGenerator<VariableSet[], void, unknown> {
        console.log(`/organizations/${orgName}/varsets`);
        yield* streamPages<VariableSet, VariableSetFilter>(
            `/organizations/${orgName}/varsets`,
            variableSetMapper,
            {},
            filter);
    }

    async *listVariableSetsForProject(projectId: string, filter?: VariableSetFilter): AsyncGenerator<VariableSet[], void, unknown> {
        yield* streamPages<VariableSet, VariableSetFilter>(
            `/projects/${projectId}/varsets`,
            variableSetMapper,
            undefined,
            filter);
    }
}
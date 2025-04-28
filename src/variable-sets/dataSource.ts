import { axiosClient } from '../common/httpClient';
import {
    VariableSet,
    VariableSetFilter,
    VariableSetResponse
} from './types';
import { variableSetMapper } from './mapper';
import { streamPages } from '../common/streamPages';

export class VariableSetsAPI {
    async getVariableSet(id: string): Promise<VariableSet> {
        const res = await axiosClient.get<VariableSetResponse>(`/varsets/${id}`);
        return variableSetMapper.map(res.data.data);
    }

    async *getOrgsVariableSets(orgName: string, filter?: VariableSetFilter): AsyncGenerator<VariableSet[], void, unknown> {
        console.log(`/organizations/${orgName}/varsets`);
        yield* streamPages<VariableSet, VariableSetFilter>(
            `/organizations/${orgName}/varsets`,
            variableSetMapper,
            {},
            filter);
    }
}
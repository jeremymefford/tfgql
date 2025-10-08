import type { AxiosInstance } from 'axios';
import { Variable, VariableFilter, VariableListResponse, VariableResponse } from './types';
import { variablesMapper } from './mapper';
import { evaluateWhereClause } from '../common/filtering/filtering';

export class VariablesAPI {
    constructor(private readonly httpClient: AxiosInstance) {}

    async getVariables(organization: string, workspaceName: string, filter?: VariableFilter): Promise<Variable[]> {
        const res = await this.httpClient.get<VariableListResponse>('/vars', {
            params: {
            'filter[organization][name]': organization,
            'filter[workspace][name]': workspaceName,
            }
        });
        return res.data.data.map(variablesMapper.map)
            .filter(variable => evaluateWhereClause(filter, variable));
    }

    async getVariablesForWorkspace(workspaceId: string, filter?: VariableFilter): Promise<Variable[]> {
        const res = await this.httpClient.get<VariableListResponse>(`/workspaces/${workspaceId}/vars`);
        return res.data.data.map(variablesMapper.map)
            .filter(variable => evaluateWhereClause(filter, variable));
    }
}

import { axiosClient } from '../common/httpClient';
import {
    VariableSet,
    VariableSetFilter,
    VariableSetResponse,
    VariableSetResponseIncludingProjects,
    VariableSetResponseIncludingVariables
} from './types';
import { variableSetMapper } from './mapper';
import { streamPages } from '../common/streamPages';
import { Variable, VariableFilter } from '../variables/types';
import { variablesMapper } from '../variables/mapper';
import { evaluateWhereClause } from '../common/filtering/filtering';
import { RequestCache } from '../common/requestCache';
import { logger } from '../common/logger';

export class VariableSetsAPI {
    private requestCache: RequestCache;

    constructor(requestCache: RequestCache) {
        this.requestCache = requestCache;
    }

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
        logger.debug({ orgName }, 'Listing variable sets for org');
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

    async listProjectIDs(varsetId: string): Promise<string[]> {
        return this.requestCache.getOrSet<string[]>(`varset_project_ids`, varsetId, async () => {
            const varsetWithProjects = await axiosClient.get<VariableSetResponseIncludingProjects>(`/varsets/${varsetId}`, {
                params: { include: 'projects' }
            });
            return varsetWithProjects.data.included
                ?.map((proj: any) => proj.id)
                || [];
        });
    }

    async listVariables(varsetId: string, filter?: VariableFilter): Promise<Variable[]> {
        return this.requestCache.getOrSet<Variable[]>(`varset_vars`, varsetId, async () => {
            const varsetWithVars = await axiosClient.get<VariableSetResponseIncludingVariables>(`/varsets/${varsetId}`, {
                params: { include: 'vars' }
            });
            return varsetWithVars.data.included
                ?.map(variablesMapper.map)
                || [];
        }).then(vars => {
            if (filter) return vars.filter(variable => evaluateWhereClause(filter, variable));
            return vars;
        });
    }
}

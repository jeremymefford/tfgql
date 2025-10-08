import type { AxiosInstance } from 'axios';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { TeamResponse, Team, TeamFilter, TeamPermissionsFilter, TeamOrganizationAccessFilter } from './types';
import { teamMapper } from './mapper';

export class TeamsAPI {
    constructor(private readonly httpClient: AxiosInstance) {}

    async *listTeams(organization: string, filter?: TeamFilter): AsyncGenerator<Team[]> {
        yield* streamPages<Team, { permissions: TeamPermissionsFilter; organizationAccess: TeamOrganizationAccessFilter }>(
            this.httpClient,
            `/organizations/${organization}/teams`,
            teamMapper,
            {},
            filter
        );
    }

    async *listTeamsByName(organization: string, nameFilter: Set<string>, filter?: TeamFilter): AsyncGenerator<Team[]> {
        const nameFilterString = Array.from(nameFilter).join(',');
       const params = { 'filter[name]': nameFilterString };
        yield* streamPages<Team, { permissions: TeamPermissionsFilter; organizationAccess: TeamOrganizationAccessFilter }>(
            this.httpClient,
            `/organizations/${organization}/teams`,
            teamMapper,
            params,
            filter
        );
    }

    async *listTeamsByQuery(organization: string, query: string, filter?: TeamFilter): AsyncGenerator<Team[]> {
        yield* streamPages<Team, { permissions: TeamPermissionsFilter; organizationAccess: TeamOrganizationAccessFilter }>(
            this.httpClient,
            `/organizations/${organization}/teams`,
            teamMapper,
            { 'q': query },
            filter
        );
    }
    
    async getTeam(id: string): Promise<Team | null> {
        return this.httpClient.get<TeamResponse>(`/teams/${id}`)
            .then(res => teamMapper.map(res.data.data))
            .catch(err => {
                if (isNotFound(err)) {
                    return null;
                }
                throw err;
            });
    }
}

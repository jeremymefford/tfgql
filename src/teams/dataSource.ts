import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { TeamResponse, Team, TeamFilter, TeamPermissionsFilter, TeamOrganizationAccessFilter } from './types';
import { teamMapper } from './mapper';

export class TeamsAPI {
    async *listTeams(organization: string, filter?: TeamFilter): AsyncGenerator<Team[]> {
        yield* streamPages<Team, { permissions: TeamPermissionsFilter; organizationAccess: TeamOrganizationAccessFilter }>(
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
            `/organizations/${organization}/teams`,
            teamMapper,
            params,
            filter
        );
    }

    async *listTeamsByQuery(organization: string, query: string, filter?: TeamFilter): AsyncGenerator<Team[]> {
        yield* streamPages<Team, { permissions: TeamPermissionsFilter; organizationAccess: TeamOrganizationAccessFilter }>(
            `/organizations/${organization}/teams`,
            teamMapper,
            { 'q': query },
            filter
        );
    }
    
    async getTeam(id: string): Promise<Team | null> {
        return axiosClient.get<TeamResponse>(`/teams/${id}`)
            .then(res => teamMapper.map(res.data.data))
            .catch(err => {
                if (err.status === 404) {
                    return null;
                }
                throw err;
            });
    }
}

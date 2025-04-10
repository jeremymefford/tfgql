import { axiosClient } from '../common/httpClient';
import { fetchAllPages } from '../common/fetchAllPages';
import { TeamResource, TeamListResponse, TeamResponse, Team, TeamFilter, TeamPermissionsFilter, TeamOrganizationAccessFilter } from './types';
import { teamMapper } from './mapper';

export class TeamsAPI {
    async listTeams(organization: string, filter?: TeamFilter): Promise<Team[]> {
        return fetchAllPages<Team, { permissions: TeamPermissionsFilter; organizationAccess: TeamOrganizationAccessFilter; }>(
            `/organizations/${organization}/teams`,
            teamMapper,
            undefined,
            filter
        );
    }

    async listTeamsByName(organization: string, nameFilter: Set<string>, filter?: TeamFilter): Promise<Team[]> {
        const nameFilterString = Array.from(nameFilter).join(',');
        const params = { 'filter[name]': nameFilterString };
        return fetchAllPages<Team, { permissions: TeamPermissionsFilter; organizationAccess: TeamOrganizationAccessFilter; }>(
            `/organizations/${organization}/teams`,
            teamMapper,
            params,
            filter
        );
    }

    async listTeamsByQuery(organization: string, query: string, filter?: TeamFilter): Promise<Team[]> {
        return fetchAllPages<Team, { permissions: TeamPermissionsFilter; organizationAccess: TeamOrganizationAccessFilter; }>(
            `/organizations/${organization}/teams`,
            teamMapper,
            { 'q': query },
            filter
        );
    }

    async getTeam(id: string): Promise<Team> {
        const res = await axiosClient.get<TeamResponse>(`/teams/${id}`);
        if (!res || !res.data || !res.data.data) {
            throw new Error(`Failed to fetch team data for team ID: ${id}`);
        }
        return teamMapper.map(res.data.data);
    }
}

import { axiosClient } from '../common/httpClient';
import { fetchAllPages } from '../common/fetchAllPages';
import { TeamResource, TeamListResponse, TeamResponse } from './types';

export class TeamsAPI {
  async listTeams(organization: string, nameFilter?: Set<string>): Promise<TeamResource[]> {
    const nameFilterString = nameFilter? Array.from(nameFilter).join(',') : undefined;
    const params = nameFilterString ? { 'filter[name]': nameFilterString } : undefined;
    return fetchAllPages<TeamResource>(`/organizations/${organization}/teams`, params);
  }

  async queryTeams(organization: string, query: string): Promise<TeamResource[]> {
    return fetchAllPages<TeamResource>(`/organizations/${organization}/teams`, { 'q': query });
  }

  async getTeam(id: string): Promise<TeamResource> {
    const res = await axiosClient.get<TeamResponse>(`/teams/${id}`);
    return res.data.data;
  }
}

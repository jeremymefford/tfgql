import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { OrganizationResponse, Organization } from './types';
import { organizationMapper } from './mapper';

export class OrganizationsAPI {
  async *listOrganizations(): AsyncGenerator<Organization[], void, unknown> {
    yield* streamPages<Organization>(
      '/organizations',
      organizationMapper
    );
  }

  async getOrganization(name: string): Promise<Organization> {
    const res = await axiosClient.get<OrganizationResponse>(`/organizations/${name}`);
    if (!res || !res.data || !res.data.data) {
      throw new Error(`Failed to fetch organization data for ${name}`);
    }
    return organizationMapper.map(res.data.data);
  }
}
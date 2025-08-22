import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { OrganizationResponse, Organization } from './types';
import { organizationMapper } from './mapper';

export class OrganizationsAPI {
  async *listOrganizations(): AsyncGenerator<Organization[]> {
    yield* streamPages<Organization>(
      '/organizations',
      organizationMapper
    );
  }

  async getOrganization(name: string): Promise<Organization | null> {
    return axiosClient.get<OrganizationResponse>(`/organizations/${name}`)
      .then(res => organizationMapper.map(res.data.data))
      .catch(err => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }
}
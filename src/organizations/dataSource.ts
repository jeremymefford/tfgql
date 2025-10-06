import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { OrganizationResponse, Organization, OrganizationFilter, OrganizationPermissionsFilter } from './types';
import { organizationMapper } from './mapper';

export class OrganizationsAPI {
  async *listOrganizations(filter?: OrganizationFilter): AsyncGenerator<Organization[]> {
    yield* streamPages<Organization, {
      permissions: OrganizationPermissionsFilter
    }>(
      '/organizations',
      organizationMapper,
      undefined,
      filter
    );
  }

  async getOrganization(name: string): Promise<Organization | null> {
    return axiosClient.get<OrganizationResponse>(`/organizations/${name}`)
      .then(res => organizationMapper.map(res.data.data))
      .catch(err => {
        if (isNotFound(err)) {
          return null;
        }
        throw err;
      });
  }
}

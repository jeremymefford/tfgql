import { axiosClient } from '../common/httpClient';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { OrganizationResponse, Organization, OrganizationFilter, OrganizationPermissionsFilter } from './types';
import { organizationMapper } from './mapper';
import { RequestCache } from '../common/requestCache';

export class OrganizationsAPI {

  private requestCache: RequestCache;

  constructor(requestCache: RequestCache) {
    this.requestCache = requestCache;
  }

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
    return this.requestCache.getOrSet<Organization | null>(
      'OrganizationGET',
      name,
      async () =>
        axiosClient.get<OrganizationResponse>(`/organizations/${name}`)
          .then(res => organizationMapper.map(res.data.data))
          .catch(err => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }));
  }
}

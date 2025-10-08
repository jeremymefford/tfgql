import type { AxiosInstance } from 'axios';
import { isNotFound } from '../common/http';
import { streamPages } from '../common/streamPages';
import { OrganizationResponse, Organization, OrganizationFilter, OrganizationPermissionsFilter } from './types';
import { organizationMapper } from './mapper';
import { RequestCache } from '../common/requestCache';

export class OrganizationsAPI {

  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache
  ) {}

  async *listOrganizations(filter?: OrganizationFilter): AsyncGenerator<Organization[]> {
    yield* streamPages<Organization, {
      permissions: OrganizationPermissionsFilter
    }>(
      this.httpClient,
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
        this.httpClient.get<OrganizationResponse>(`/organizations/${name}`)
          .then(res => organizationMapper.map(res.data.data))
          .catch(err => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }));
  }
}

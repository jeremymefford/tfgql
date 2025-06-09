import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import { organizationTagMapper } from './mapper';
import { OrganizationTag, OrganizationTagFilter, OrganizationTagResponse } from './types';

export class OrganizationTagsAPI {
  async *listOrganizationTags(orgName: string, filter?: OrganizationTagFilter): AsyncGenerator<OrganizationTag[], void, unknown> {
    yield* streamPages<OrganizationTag, OrganizationTagFilter>(
      `/organizations/${orgName}/tags`,
      organizationTagMapper,
      undefined,
      filter
    );
  }

  async getOrganizationTag(id: string): Promise<OrganizationTag> {
    const res = await axiosClient.get<OrganizationTagResponse>(`/organization-tags/${id}`);
    return organizationTagMapper.map(res.data.data);
  }
}
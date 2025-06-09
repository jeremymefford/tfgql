import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import {
  OrganizationMembership,
  OrganizationMembershipFilter,
  OrganizationMembershipResponse
} from './types';
import { organizationMembershipMapper } from './mapper';

export class OrganizationMembershipsAPI {
  async *listOrganizationMemberships(orgName: string, filter?: OrganizationMembershipFilter): AsyncGenerator<
    OrganizationMembership[],
    void,
    unknown
  > {
    yield* streamPages<OrganizationMembership, OrganizationMembershipFilter>(
      `/organizations/${orgName}/organization-memberships`,
      organizationMembershipMapper,
      undefined,
      filter
    );
  }

  async getOrganizationMembership(id: string): Promise<OrganizationMembership> {
    const res = await axiosClient.get<OrganizationMembershipResponse>(`/organization-memberships/${id}`);
    return organizationMembershipMapper.map(res.data.data);
  }
}
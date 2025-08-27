import { axiosClient } from '../common/httpClient';
import { streamPages } from '../common/streamPages';
import {
  OrganizationMembership,
  OrganizationMembershipFilter,
  OrganizationMembershipListResponse,
  OrganizationMembershipResponse
} from './types';
import { organizationMembershipMapper } from './mapper';
import { evaluateWhereClause } from '../common/filtering/filtering';

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

  async getOrganizationMembership(id: string): Promise<OrganizationMembership | null> {
    return axiosClient.get<OrganizationMembershipResponse>(`/organization-memberships/${id}`)
      .then(res => organizationMembershipMapper.map(res.data.data))
      .catch(err => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      });
  }

  async myOrganizationMemberships(filter?: OrganizationMembershipFilter): Promise<OrganizationMembership[]> {
    return axiosClient.get<OrganizationMembershipListResponse>(`/organization-memberships`)
      .then(res =>
        res.data.data
          .map(organizationMembershipMapper.map)
          .filter(orgMembership => evaluateWhereClause(filter, orgMembership)))
      .catch(err => {
        if (err.status === 404) {
          return [];
        }
        throw err;
      });
  }
}
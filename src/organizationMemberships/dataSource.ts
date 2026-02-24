import type { AxiosInstance } from "axios";
import { isNotFound } from "../common/http";
import { streamPages } from "../common/streamPages";
import {
  OrganizationMembership,
  OrganizationMembershipFilter,
  OrganizationMembershipListResponse,
  OrganizationMembershipResponse,
} from "./types";
import { organizationMembershipMapper } from "./mapper";
import { evaluateWhereClause } from "../common/filtering/filtering";
import { RequestCache } from "../common/requestCache";

export class OrganizationMembershipsAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async *listOrganizationMemberships(
    orgName: string,
    filter?: OrganizationMembershipFilter,
  ): AsyncGenerator<OrganizationMembership[], void, unknown> {
    yield* streamPages<OrganizationMembership, OrganizationMembershipFilter>(
      this.httpClient,
      `/organizations/${orgName}/organization-memberships`,
      organizationMembershipMapper,
      undefined,
      filter,
    );
  }

  async getOrganizationMembership(
    id: string,
  ): Promise<OrganizationMembership | null> {
    return this.requestCache.getOrSet<OrganizationMembership | null>(
      "organizationMembership",
      id,
      async () =>
        this.httpClient
          .get<OrganizationMembershipResponse>(`/organization-memberships/${id}`)
          .then((res) => organizationMembershipMapper.map(res.data.data))
          .catch((err) => {
            if (isNotFound(err)) {
              return null;
            }
            throw err;
          }),
    );
  }

  async myOrganizationMemberships(
    filter?: OrganizationMembershipFilter,
  ): Promise<OrganizationMembership[]> {
    return this.httpClient
      .get<OrganizationMembershipListResponse>(`/organization-memberships`)
      .then((res) =>
        res.data.data
          .map(organizationMembershipMapper.map)
          .filter((orgMembership) =>
            evaluateWhereClause(filter, orgMembership),
          ),
      )
      .catch((err) => {
        if (isNotFound(err)) {
          return [];
        }
        throw err;
      });
  }
}

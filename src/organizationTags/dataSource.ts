import type { AxiosInstance } from "axios";
import { streamPages } from "../common/streamPages";
import { organizationTagMapper } from "./mapper";
import { OrganizationTag, OrganizationTagFilter } from "./types";

export class OrganizationTagsAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *listOrganizationTags(
    orgName: string,
    filter?: OrganizationTagFilter,
  ): AsyncGenerator<OrganizationTag[], void, unknown> {
    yield* streamPages<OrganizationTag, OrganizationTagFilter>(
      this.httpClient,
      `/organizations/${orgName}/tags`,
      organizationTagMapper,
      undefined,
      filter,
    );
  }
}

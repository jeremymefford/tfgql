import type { AxiosInstance } from "axios";
import { gatherAsyncGeneratorPromises, streamPages } from "../common/streamPages";
import { adminUserMapper } from "./mapper";
import type { AdminUser } from "./types";
import type { UserFilter } from "../users/types";

interface ListUsersOptions {
  search?: string;
  admin?: boolean;
  suspended?: boolean;
  filter?: UserFilter;
  organizationId?: string;
}

export class AdminAPI {
  constructor(private readonly httpClient: AxiosInstance) { }

  async listUsers(options: ListUsersOptions = {}): Promise<AdminUser[]> {
    const params: Record<string, unknown> = {};

    if (options.search) {
      params.q = options.search;
    }
    if (options.admin) {
      params["filter[admin]"] = options.admin;
    }
    if (options.suspended) {
      params["filter[suspended]"] = options.suspended;
    }

    const users = await gatherAsyncGeneratorPromises(streamPages<AdminUser, UserFilter>(
      this.httpClient,
      "/admin/users",
      adminUserMapper,
      params,
      options.filter,
    ));

    return params.organizationId
      ? users.filter((user) => user.organizationIds.includes(options.organizationId as string))
      : users;
  }
}

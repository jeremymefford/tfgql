import type { AxiosInstance } from "axios";
import { streamPages } from "../common/streamPages";
import { adminUserMapper } from "./mapper";
import type { AdminUser } from "./types";
import type { UserFilter } from "../users/types";

interface ListUsersOptions {
  search?: string;
  admin?: boolean;
  suspended?: boolean;
  filter?: UserFilter;
}

export class AdminAPI {
  constructor(private readonly httpClient: AxiosInstance) {}

  async *listUsers(options: ListUsersOptions = {}): AsyncGenerator<AdminUser[]> {
    const params: Record<string, unknown> = {};

    if (options.search) {
      params.q = options.search;
    }
    if (typeof options.admin === "boolean") {
      params["filter[admin]"] = options.admin;
    }
    if (typeof options.suspended === "boolean") {
      params["filter[suspended]"] = options.suspended;
    }

    yield* streamPages<AdminUser, UserFilter>(
      this.httpClient,
      "/admin/users",
      adminUserMapper,
      params,
      options.filter,
    );
  }
}

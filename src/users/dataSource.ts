import type { AxiosInstance } from "axios";
import { RequestCache } from "../common/requestCache";
import { userMapper } from "./mapper";
import { logger } from "../common/logger";
import { User, UserResponse } from "./types";
import { isNotFound } from "../common/http";

export class UsersAPI {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly requestCache: RequestCache,
  ) {}

  async getUser(userId: string): Promise<User | null> {
    return this.requestCache.getOrSet<User | null>("user", userId, async () => {
      return this.httpClient
        .get<UserResponse>(`/users/${userId}`)
        .then((res) => {
          return userMapper.map(res.data.data);
        })
        .catch((error) => {
          if (isNotFound(error)) {
            return null;
          }
          logger.error({ err: error, userId }, "Failed to fetch user");
          throw error;
        });
    });
  }

  async getCurrentUser(): Promise<User> {
    const res = await this.httpClient.get<UserResponse>("/account/details");
    return userMapper.map(res.data.data);
  }
}

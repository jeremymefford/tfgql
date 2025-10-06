import { axiosClient } from '../common/httpClient';
import { RequestCache } from '../common/requestCache';
import { userMapper } from './mapper';
import { logger } from '../common/logger';
import { User, UserResponse } from './types';
import { isNotFound } from '../common/http';

export class UsersAPI {
  private requestCache: RequestCache;

  constructor(requestCache: RequestCache) {
    this.requestCache = requestCache;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.requestCache.getOrSet<User | null>('user', userId, async () => {
      return axiosClient.get<UserResponse>(`/users/${userId}`).then(res => {
        return userMapper.map(res.data.data);
      }).catch(error => {
        if (isNotFound(error)) {
          return null;
        }
        logger.error({ err: error, userId }, 'Failed to fetch user');
        throw error;
      });
    });
  }

  async getCurrentUser(): Promise<User> {
    const res = await axiosClient.get<UserResponse>('/account/details');
    return userMapper.map(res.data.data);
  }
}

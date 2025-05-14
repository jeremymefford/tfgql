import { axiosClient } from '../common/httpClient';
import { RequestCache } from '../common/requestCache';
import { userMapper } from './mapper';
import { User, UserResponse } from './types';

export class UsersAPI {

  async getUser(userId: string, cache: RequestCache): Promise<User | null> {
    return cache.getOrSet<User | null>('user', userId, async () => {
      return axiosClient.get<UserResponse>(`/users/${userId}`).then(res => {
        return userMapper.map(res.data.data);
      }).catch(error => {
        console.error(`Failed to fetch user with ID ${userId}:`, error);
        return null;
      });
    });
  }

  async getCurrentUser(): Promise<User> {
    const res = await axiosClient.get<UserResponse>('/account/details');
    return userMapper.map(res.data.data);
  }
}
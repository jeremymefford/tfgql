import { axiosClient } from '../common/httpClient';
import { userMapper } from './mapper';
import { User, UserResponse } from './types';

export class UsersAPI {

  async getUser(userId: string): Promise<User> {
    const res = await axiosClient.get<UserResponse>(`/users/${userId}`);
    return userMapper.map(res.data.data);
  }

  async getCurrentUser(): Promise<User> {
    const res = await axiosClient.get<UserResponse>('/account/details');
    return userMapper.map(res.data.data);
  }
}
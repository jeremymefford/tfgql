import { axiosClient } from '../common/httpClient';
import { UserResource, UserListResponse, UserResponse } from './types';

export class UsersAPI {
  async listUsers(): Promise<UserResource[]> {
    const res = await axiosClient.get<UserListResponse>('/admin/users');
    return res.data.data;
  }

  async getUser(userId: string): Promise<UserResource> {
    const res = await axiosClient.get<UserResponse>(`/admin/users/${userId}`);
    return res.data.data;
  }

  /** Get the current authenticated user (non-admin endpoint) */
  async getCurrentUser(): Promise<UserResource> {
    const res = await axiosClient.get<UserResponse>('/account/details');
    return res.data.data;
  }
}
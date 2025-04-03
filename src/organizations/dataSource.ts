import { axiosClient } from '../common/httpClient';
import { OrganizationResource, OrganizationListResponse, OrganizationResponse } from './types';

export class OrganizationsAPI {
  /** Fetch all organizations the token has access to */
  async listOrganizations(): Promise<OrganizationResource[]> {
    const res = await axiosClient.get<OrganizationListResponse>('/organizations');
    return res.data.data;
  }

  /** Fetch a single organization by name (slug) */
  async getOrganization(name: string): Promise<OrganizationResource> {
    const res = await axiosClient.get<OrganizationResponse>(`/organizations/${name}`);
    return res.data.data;
  }

  // Additional endpoints (create, update, delete) could be added here as needed.
}
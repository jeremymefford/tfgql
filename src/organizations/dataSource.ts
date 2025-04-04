import { axiosClient } from '../common/httpClient';
import { fetchAllPages } from '../common/fetchAllPages';
import { OrganizationResource, OrganizationListResponse, OrganizationResponse } from './types';

export class OrganizationsAPI {
  async listOrganizations(): Promise<OrganizationResource[]> {
    return fetchAllPages<OrganizationResource>('/organizations');
  }

  async getOrganization(name: string): Promise<OrganizationResource> {
    const res = await axiosClient.get<OrganizationResponse>(`/organizations/${name}`);
    return res.data.data;
  }
}
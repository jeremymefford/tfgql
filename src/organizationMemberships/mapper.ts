import { DomainMapper } from "../common/middleware/domainMapper";
import {
  OrganizationMembershipResource,
  OrganizationMembership,
} from "./types";

export const organizationMembershipMapper: DomainMapper<
  OrganizationMembershipResource,
  OrganizationMembership
> = {
  map(resource: OrganizationMembershipResource): OrganizationMembership {
    return {
      id: resource.id,
      status: resource.attributes.status,
      organizationId: resource.relationships!.organization.data.id,
      userId: resource.relationships!.user.data.id,
      teamIds: resource.relationships!.teams.data.map((rel) => rel.id),
    };
  },
};

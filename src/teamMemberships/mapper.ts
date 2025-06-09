import { DomainMapper } from '../common/middleware/domainMapper';
import { TeamMembershipResource, TeamMembership } from './types';

export const teamMembershipMapper: DomainMapper<TeamMembershipResource, TeamMembership> = {
  map(resource: TeamMembershipResource): TeamMembership {
    return {
      id: resource.id,
      // TODO: map additional fields from resource.attributes and resource.relationships
    };
  }
};
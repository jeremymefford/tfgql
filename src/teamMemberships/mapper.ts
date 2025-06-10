import { DomainMapper } from '../common/middleware/domainMapper';
import { TeamMembershipResource, TeamMembership } from './types';

export const teamMembershipMapper: DomainMapper<TeamMembershipResource, TeamMembership> = {
  map(resource: TeamMembershipResource): TeamMembership {
    return {
      id: resource.id,
      teamId: resource.relationships!.team.data.id,
      userId: resource.relationships!.user.data.id,
    };
  },
};
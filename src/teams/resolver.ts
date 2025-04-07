import { Context } from '../server/context';
import { mapOrganizationResourceToDomain } from '../organizations/resolvers';
import { Team, TeamResource } from './types';
import { mapUserResourceToDomain } from '../users/resolvers';
import { batchResourceFetch } from '../common/batchResourceFetch';

export function mapTeamResourceToDomain(resource: TeamResource): Team {
    return {
        id: resource.id,
        name: resource.attributes.name,
        ssoTeamId: resource.attributes['sso-team-id'],
        usersCount: resource.attributes['users-count'],
        visibility: resource.attributes.visibility,
        allowMemberTokenManagement: resource.attributes['allow-member-token-management'],
        permissions: resource.attributes.permissions ?? {},
        organizationAccess: resource.attributes['organization-access'] ?? {},
        organizationId: resource.relationships.organization.data.id,
        userIds: (resource.relationships.users.data).map(userMetadata => userMetadata.id),
    };
}

export const resolvers = {
    Query: {
        teams: async (_: unknown, { organizationName } : { organizationName: string }, { dataSources }: Context): Promise<Team[]> => {
            const teamResources = await dataSources.teamsAPI.listTeams(organizationName);
            return teamResources.map(mapTeamResourceToDomain);
        },
        team: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Team | null> => {
            const teamResource = await dataSources.teamsAPI.getTeam(id);
            return mapTeamResourceToDomain(teamResource);
        }
    },
    Team: {
        users: async (team: Team, _: unknown, { dataSources }: Context) => {
            const users = await batchResourceFetch(team.userIds, id => dataSources.usersAPI.getUser(id));
            return users.map(mapUserResourceToDomain);
        },
        organization: async (team: Team, _: unknown, { dataSources }: Context) => {
            const organizationResource = await dataSources.organizationsAPI.getOrganization(team.organizationId);
            return mapOrganizationResourceToDomain(organizationResource);
        }
    }
};

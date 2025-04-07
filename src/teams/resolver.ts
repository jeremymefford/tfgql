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
        permissions: {
            canUpdateMembership: resource.attributes.permissions?.['can-update-membership'] ?? false,
            canDestroy: resource.attributes.permissions?.['can-destroy'] ?? false,
            canUpdateOrganizationAccess: resource.attributes.permissions?.['can-update-organization-access'] ?? false,
            canUpdateApiToken: resource.attributes.permissions?.['can-update-api-token'] ?? false,
            canUpdateVisibility: resource.attributes.permissions?.['can-update-visibility'] ?? false,
            canUpdateName: resource.attributes.permissions?.['can-update-name'] ?? false,
            canUpdateSsoTeamId: resource.attributes.permissions?.['can-update-sso-team-id'] ?? false,
            canUpdateMemberTokenManagement: resource.attributes.permissions?.['can-update-member-token-management'] ?? false,
            canViewApiToken: resource.attributes.permissions?.['can-view-api-token'] ?? false
        },
        organizationAccess: {
            managePolicies: resource.attributes['organization-access']?.['manage-policies'] ?? false,
            manageWorkspaces: resource.attributes['organization-access']?.['manage-workspaces'] ?? false,
            manageVcsSettings: resource.attributes['organization-access']?.['manage-vcs-settings'] ?? false,
            managePolicyOverrides: resource.attributes['organization-access']?.['manage-policy-overrides'] ?? false,
            manageModules: resource.attributes['organization-access']?.['manage-modules'] ?? false,
            manageProviders: resource.attributes['organization-access']?.['manage-providers'] ?? false,
            manageRunTasks: resource.attributes['organization-access']?.['manage-run-tasks'] ?? false,
            manageProjects: resource.attributes['organization-access']?.['manage-projects'] ?? false,
            manageMembership: resource.attributes['organization-access']?.['manage-membership'] ?? false,
            manageTeams: resource.attributes['organization-access']?.['manage-teams'] ?? false,
            manageOrganizationAccess: resource.attributes['organization-access']?.['manage-organization-access'] ?? false,
            accessSecretTeams: resource.attributes['organization-access']?.['access-secret-teams'] ?? false,
            readProjects: resource.attributes['organization-access']?.['read-projects'] ?? false,
            readWorkspaces: resource.attributes['organization-access']?.['read-workspaces'] ?? false,
            manageAgentPools: resource.attributes['organization-access']?.['manage-agent-pools'] ?? false
        },
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

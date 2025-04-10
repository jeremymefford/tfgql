import { Context } from '../server/context';
import { Team, TeamFilter } from './types';
import { batchResourceFetch } from '../common/batchResourceFetch';
import { User, UserFilter } from '../users/types';

export const resolvers = {
    Query: {
        teams: async (_: unknown, { organizationName, filter }: { organizationName: string, filter?: TeamFilter }, { dataSources }: Context): Promise<Team[]> => {
            const teams = await dataSources.teamsAPI.listTeams(organizationName, filter);
            return teams;
        },
        teamsByName: async (_: unknown, { organizationName, names, filter }: { organizationName: string, names: string[], filter?: TeamFilter }, { dataSources }: Context): Promise<Team[]> => {
            const teams = await dataSources.teamsAPI.listTeamsByName(organizationName, new Set(names), filter);
            return teams;
        },
        teamsByQuery: async (_: unknown, { organizationName, query, filter }: { organizationName: string, query: string, filter?: TeamFilter }, { dataSources }: Context): Promise<Team[]> => {
            const teams = await dataSources.teamsAPI.listTeamsByQuery(organizationName, query, filter);
            return teams;
        },
        team: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Team | null> => {
            const team = await dataSources.teamsAPI.getTeam(id);
            return team;
        }
    },
    Team: {
        users: async (team: Team, { filter }: { filter?: UserFilter }, { dataSources }: Context): Promise<User[]> => {
            const users = await batchResourceFetch(team.userIds, id => dataSources.usersAPI.getUser(id), filter);
            return users;
        },
        organization: async (team: Team, _: unknown, { dataSources }: Context) => {
            const organization = await dataSources.organizationsAPI.getOrganization(team.organizationId);
            return organization;
        }
    }
};

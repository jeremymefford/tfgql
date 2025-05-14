import { Context } from '../server/context';
import { Team, TeamFilter } from './types';
import { fetchResources } from '../common/fetchResources';
import { User, UserFilter } from '../users/types';
import { gatherAsyncGeneratorPromises } from '../common/streamPages';

export const resolvers = {
    Query: {
        teams: async (_: unknown, { organization, filter }: { organization: string, filter?: TeamFilter }, { dataSources }: Context): Promise<Promise<Team>[]> => {
            return gatherAsyncGeneratorPromises(dataSources.teamsAPI.listTeams(organization, filter));
        },
        teamsByName: async (_: unknown, { organization, names, filter }: { organization: string, names: string[], filter?: TeamFilter }, { dataSources }: Context): Promise<Promise<Team>[]> => {
            return gatherAsyncGeneratorPromises(dataSources.teamsAPI.listTeamsByName(organization, new Set(names), filter));
        },
        teamsByQuery: async (_: unknown, { organization, query, filter }: { organization: string, query: string, filter?: TeamFilter }, { dataSources }: Context): Promise<Promise<Team>[]> => {
            return gatherAsyncGeneratorPromises(dataSources.teamsAPI.listTeamsByQuery(organization, query, filter));
        },
        team: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<Team | null> => {
            const team = await dataSources.teamsAPI.getTeam(id);
            return team;
        }
    },
    Team: {
        users: async (team: Team, { filter }: { filter?: UserFilter }, ctx: Context): Promise<User[]> => {
            return fetchResources<string, User, UserFilter>(
                team.userIds, 
                id => ctx.dataSources.usersAPI.getUser(id), 
                filter);
        },
        organization: async (team: Team, _: unknown, { dataSources }: Context) => {
            const organization = await dataSources.organizationsAPI.getOrganization(team.organizationId);
            return organization;
        }
    }
};

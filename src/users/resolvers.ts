import { Context } from '../server/context';
import { User, UserFilter } from './types';



export const resolvers = {
  Query: {
    user: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<User | null> => {
      const userResource = await dataSources.usersAPI.getUser(id);
      return userResource;
    },
    me: async (_: unknown, __: unknown, { dataSources }: Context): Promise<User> => {
      const userResource = await dataSources.usersAPI.getCurrentUser();
      return userResource;
    }
  }
};
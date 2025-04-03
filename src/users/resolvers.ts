import { Context } from '../server/context';
import { User } from './types';

export const resolvers = {
  Query: {
    users: async (_: unknown, __: unknown, { dataSources }: Context): Promise<User[]> => {
      const userResources = await dataSources.usersAPI.listUsers();
      return userResources.map(user => ({
        id: user.id,
        username: user.attributes.username,
        email: user.attributes.email,
        avatarUrl: user.attributes['avatar-url']
      }));
    },
    user: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<User | null> => {
      const userResource = await dataSources.usersAPI.getUser(id);
      if (!userResource) return null;
      return {
        id: userResource.id,
        username: userResource.attributes.username,
        email: userResource.attributes.email,
        avatarUrl: userResource.attributes['avatar-url']
      };
    },
    me: async (_: unknown, __: unknown, { dataSources }: Context): Promise<User> => {
      const userResource = await dataSources.usersAPI.getCurrentUser();
      return {
        id: userResource.id,
        username: userResource.attributes.username,
        email: userResource.attributes.email,
        avatarUrl: userResource.attributes['avatar-url']
      };
    }
  },
  Mutation: {}
};
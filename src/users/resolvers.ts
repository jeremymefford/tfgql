import { Context } from '../server/context';
import { User } from './types';

export function mapUserResourceToDomain(user: any): User {
  return {
    id: user.id,
    username: user.attributes.username,
    email: user.attributes.email,
    avatarUrl: user.attributes['avatar-url'],
    isServiceAccount: user.attributes['is-service-account'],
    authMethod: user.attributes['auth-method'],
    v2Only: user.attributes['v2-only'],
    permissions: {
      canCreateOrganizations: user.attributes.permissions?.['can-create-organizations'] ?? false,
      canChangeEmail: user.attributes.permissions?.['can-change-email'] ?? false,
      canChangeUsername: user.attributes.permissions?.['can-change-username'] ?? false
    }
  };
}

export const resolvers = {
  Query: {
    users: async (_: unknown, __: unknown, { dataSources }: Context): Promise<User[]> => {
      const userResources = await dataSources.usersAPI.listUsers();
      return userResources.map(mapUserResourceToDomain);
    },
    user: async (_: unknown, { id }: { id: string }, { dataSources }: Context): Promise<User | null> => {
      const userResource = await dataSources.usersAPI.getUser(id);
      return userResource ? mapUserResourceToDomain(userResource) : null;
    },
    me: async (_: unknown, __: unknown, { dataSources }: Context): Promise<User> => {
      const userResource = await dataSources.usersAPI.getCurrentUser();
      return mapUserResourceToDomain(userResource);
    }
  }
};
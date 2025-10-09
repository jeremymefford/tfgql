import { Context } from "../server/context";
import { User } from "./types";

export const resolvers = {
  Query: {
    user: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ): Promise<User | null> => {
      const userResource = await ctx.dataSources.usersAPI.getUser(id);
      return userResource;
    },
    me: async (_: unknown, __: unknown, ctx: Context): Promise<User> => {
      const userResource = await ctx.dataSources.usersAPI.getCurrentUser();
      return userResource;
    },
  },
};

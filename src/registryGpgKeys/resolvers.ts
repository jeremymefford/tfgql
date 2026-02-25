import { Context } from "../server/context";
import { RegistryGpgKey } from "./types";
import { Organization } from "../organizations/types";

export const resolvers = {
  RegistryGpgKey: {
    organization: async (
      parent: RegistryGpgKey,
      _: unknown,
      ctx: Context,
    ): Promise<Organization | null> => {
      return ctx.dataSources.organizationsAPI.getOrganization(parent.namespace);
    },
  },
};

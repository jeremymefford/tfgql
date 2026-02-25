import { Context } from "../server/context";
import { RegistryProviderPlatform } from "./types";
import { RegistryProviderVersion } from "../registryProviderVersions/types";

export const resolvers = {
  RegistryProviderPlatform: {
    registryProviderVersion: async (
      platform: RegistryProviderPlatform,
      _: unknown,
      { dataSources }: Context,
    ): Promise<RegistryProviderVersion | null> => {
      if (!platform.registryProviderVersionId) return null;
      return dataSources.registryProviderVersionsAPI.getRegistryProviderVersionById(
        platform.registryProviderVersionId,
      );
    },
  },
};

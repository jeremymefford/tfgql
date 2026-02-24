import { Context } from "../server/context";
import { RegistryProvider } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import {
  RegistryProviderVersion,
  RegistryProviderVersionFilter,
} from "../registryProviderVersions/types";

export const resolvers = {
  RegistryProvider: {
    versions: async (
      provider: RegistryProvider,
      { filter }: { filter?: RegistryProviderVersionFilter },
      { dataSources }: Context,
    ): Promise<RegistryProviderVersion[]> => {
      if (!provider.organizationName) {
        return [];
      }
      return gatherAsyncGeneratorPromises(
        dataSources.registryProviderVersionsAPI.listRegistryProviderVersions(
          provider.organizationName,
          provider.registryName,
          provider.namespace,
          provider.name,
          filter,
        ),
      );
    },
  },
};

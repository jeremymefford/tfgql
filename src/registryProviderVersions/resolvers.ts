import { Context } from "../server/context";
import { RegistryProviderVersion } from "./types";
import { RegistryProvider } from "../registryProviders/types";
import { RegistryGpgKey } from "../registryGpgKeys/types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import {
  RegistryProviderPlatform,
  RegistryProviderPlatformFilter,
} from "../registryProviderPlatforms/types";

export const resolvers = {
  RegistryProviderVersion: {
    registryProvider: async (
      versionObj: RegistryProviderVersion,
      _: unknown,
      { dataSources }: Context,
    ): Promise<RegistryProvider | null> => {
      if (!versionObj.registryProviderId) return null;
      return dataSources.registryProvidersAPI.getRegistryProviderById(
        versionObj.registryProviderId,
      );
    },
    gpgKey: async (
      versionObj: RegistryProviderVersion,
      _: unknown,
      { dataSources }: Context,
    ): Promise<RegistryGpgKey | null> => {
      if (!versionObj.keyId || !versionObj.registryProviderId) return null;
      const provider =
        await dataSources.registryProvidersAPI.getRegistryProviderById(
          versionObj.registryProviderId,
        );
      if (!provider) return null;
      return dataSources.registryGpgKeysAPI.getRegistryGpgKey(
        provider.registryName,
        provider.namespace,
        versionObj.keyId,
      );
    },
    platforms: async (
      versionObj: RegistryProviderVersion,
      { filter }: { filter?: RegistryProviderPlatformFilter },
      { dataSources }: Context,
    ): Promise<RegistryProviderPlatform[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.registryProviderPlatformsAPI.listRegistryProviderPlatformsByVersionId(
          versionObj.id,
          filter,
        ),
      );
    },
  },
};

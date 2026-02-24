import { Context } from "../server/context";
import { RegistryProviderVersion } from "./types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import {
  RegistryProviderPlatform,
  RegistryProviderPlatformFilter,
} from "../registryProviderPlatforms/types";

export const resolvers = {
  RegistryProviderVersion: {
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

import { Context } from "../server/context";
import { Registry } from "./types";
import { RegistryModuleFilter, RegistryModule } from "../registryModules/types";
import {
  RegistryProviderFilter,
  RegistryProvider,
} from "../registryProviders/types";
import { RegistryGpgKeyFilter, RegistryGpgKey } from "../registryGpgKeys/types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { coalesceOrgs } from "../common/orgHelper";

export const resolvers = {
  Query: {
    registries: async (
      _: unknown,
      {
        includeOrgs,
        excludeOrgs,
      }: {
        includeOrgs?: string[];
        excludeOrgs?: string[];
      },
      ctx: Context,
    ): Promise<Registry[]> => {
      const orgs = await coalesceOrgs(ctx, includeOrgs, excludeOrgs);
      return orgs.map((organizationName) => ({ organizationName }));
    },
  },
  Registry: {
    modules: async (
      parent: Registry,
      { filter }: { filter?: RegistryModuleFilter },
      { dataSources }: Context,
    ): Promise<RegistryModule[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.registryModulesAPI.listRegistryModules(
          parent.organizationName,
          filter,
        ),
      );
    },
    providers: async (
      parent: Registry,
      { filter }: { filter?: RegistryProviderFilter },
      { dataSources }: Context,
    ): Promise<RegistryProvider[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.registryProvidersAPI.listRegistryProviders(
          parent.organizationName,
          filter,
        ),
      );
    },
    gpgKeys: async (
      parent: Registry,
      { filter }: { filter?: RegistryGpgKeyFilter },
      { dataSources }: Context,
    ): Promise<RegistryGpgKey[]> => {
      return gatherAsyncGeneratorPromises(
        dataSources.registryGpgKeysAPI.listRegistryGpgKeys(
          "private",
          parent.organizationName,
          filter,
        ),
      );
    },
  },
};

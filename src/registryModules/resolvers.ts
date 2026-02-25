import { Context } from "../server/context";
import {
  RegistryModule,
  RegistryModuleVersionDetail,
  RegistryModuleVersionDetailFilter,
} from "./types";
import { Organization } from "../organizations/types";
import { gatherAsyncGeneratorPromises } from "../common/streamPages";
import { evaluateWhereClause } from "../common/filtering/filtering";
import {
  RegistryTestRun,
  RegistryTestRunFilter,
  RegistryTestVariable,
  RegistryTestVariableFilter,
} from "../registryTests/types";

export const resolvers = {
  RegistryModule: {
    organization: async (
      parent: RegistryModule,
      _: unknown,
      ctx: Context,
    ): Promise<Organization | null> => {
      if (!parent.organizationName) return null;
      return ctx.dataSources.organizationsAPI.getOrganization(
        parent.organizationName,
      );
    },
    versions: async (
      parent: RegistryModule,
      { filter }: { filter?: RegistryModuleVersionDetailFilter },
      { dataSources }: Context,
    ): Promise<RegistryModuleVersionDetail[]> => {
      const versions =
        await dataSources.registryModulesAPI.listModuleVersions(
          parent.namespace,
          parent.name,
          parent.provider,
        );
      if (!filter) {
        return versions;
      }
      return versions.filter((v) => evaluateWhereClause(filter, v));
    },
    testRuns: async (
      parent: RegistryModule,
      { filter }: { filter?: RegistryTestRunFilter },
      { dataSources }: Context,
    ): Promise<RegistryTestRun[]> => {
      if (!parent.organizationName) {
        return [];
      }
      return gatherAsyncGeneratorPromises(
        dataSources.registryTestsAPI.listRegistryTestRuns(
          parent.organizationName,
          parent.namespace,
          parent.name,
          parent.provider,
          filter,
        ),
      );
    },
    testVariables: async (
      parent: RegistryModule,
      { filter }: { filter?: RegistryTestVariableFilter },
      { dataSources }: Context,
    ): Promise<RegistryTestVariable[]> => {
      if (!parent.organizationName) {
        return [];
      }
      return gatherAsyncGeneratorPromises(
        dataSources.registryTestsAPI.listRegistryTestVariables(
          parent.organizationName,
          parent.namespace,
          parent.name,
          parent.provider,
          filter,
        ),
      );
    },
  },
};

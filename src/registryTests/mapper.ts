import { DomainMapper } from "../common/middleware/domainMapper";
import {
  RegistryTestRunResource,
  RegistryTestRun,
  RegistryTestVariableResource,
  RegistryTestVariable,
} from "./types";

export const registryTestRunMapper: DomainMapper<
  RegistryTestRunResource,
  RegistryTestRun
> = {
  map(resource: RegistryTestRunResource): RegistryTestRun {
    return {
      id: resource.id,
      status: resource.attributes.status,
      createdAt: resource.attributes["created-at"],
      updatedAt: resource.attributes["updated-at"],
      logReadUrl: resource.attributes["log-read-url"],
    };
  },
};

export const registryTestVariableMapper: DomainMapper<
  RegistryTestVariableResource,
  RegistryTestVariable
> = {
  map(resource: RegistryTestVariableResource): RegistryTestVariable {
    return {
      id: resource.id,
      key: resource.attributes.key,
      value: resource.attributes.value,
      category: resource.attributes.category,
      hcl: resource.attributes.hcl,
      sensitive: resource.attributes.sensitive,
    };
  },
};

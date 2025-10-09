import { DomainMapper } from "../common/middleware/domainMapper";
import { RunTriggerResource, RunTrigger, WorkspaceRunTrigger } from "./types";

export const inboundRunTriggerMapper: DomainMapper<
  RunTriggerResource,
  RunTrigger & { inbound: true }
> = {
  map(resource: RunTriggerResource): RunTrigger & { inbound: true } {
    return {
      ...runTriggerMapper.map({ ...resource }),
      inbound: true,
    };
  },
};

export const outboundRunTriggerMapper: DomainMapper<
  RunTriggerResource,
  WorkspaceRunTrigger
> = {
  map(resource: RunTriggerResource): WorkspaceRunTrigger {
    return {
      ...runTriggerMapper.map(resource),
      inbound: false,
    };
  },
};

export const runTriggerMapper: DomainMapper<RunTriggerResource, RunTrigger> = {
  map(resource: RunTriggerResource): RunTrigger {
    const attrs = resource.attributes;
    return {
      id: resource.id,
      workspaceName: attrs["workspace-name"],
      sourceableName: attrs["sourceable-name"],
      createdAt: attrs["created-at"],
      workspace: resource.relationships?.workspace?.data,
      sourceable: resource.relationships?.sourceable?.data,
    };
  },
};

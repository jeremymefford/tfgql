import { DomainMapper } from "../common/middleware/domainMapper";
import { AgentPoolResource, AgentPool } from "./types";

export const agentPoolMapper: DomainMapper<AgentPoolResource, AgentPool> = {
  map(resource: AgentPoolResource): AgentPool {
    return {
      id: resource.id,
      type: resource.type,
      name: resource.attributes.name,
      createdAt: resource.attributes["created-at"],
      organizationScoped: resource.attributes["organization-scoped"],
      agentCount: resource.attributes["agent-count"],
      workspaceIds:
        resource.relationships?.workspaces.data.map((r) => r.id) ?? [],
      allowedWorkspaceIds:
        resource.relationships?.["allowed-workspaces"].data.map((r) => r.id) ??
        [],
    };
  },
};

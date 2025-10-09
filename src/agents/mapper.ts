import { DomainMapper } from "../common/middleware/domainMapper";
import { AgentResource, Agent } from "./types";

export const agentMapper: DomainMapper<AgentResource, Agent> = {
  map(resource: AgentResource): Agent {
    return {
      id: resource.id,
      name: resource.attributes.name,
      status: resource.attributes.status,
      ipAddress: resource.attributes["ip-address"],
      lastPingAt: resource.attributes["last-ping-at"],
    };
  },
};

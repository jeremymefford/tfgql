import { DomainMapper } from "../common/middleware/domainMapper";
import {
  WorkspaceTeamAccessResource,
  WorkspaceTeamAccess,
} from "./types";

export const workspaceTeamAccessMapper: DomainMapper<
  WorkspaceTeamAccessResource,
  WorkspaceTeamAccess
> = {
  map(resource: WorkspaceTeamAccessResource): WorkspaceTeamAccess {
    const attrs = resource.attributes;
    const relationships = resource.relationships ?? {};

    return {
      id: resource.id,
      access: attrs.access,
      runs: attrs.runs,
      variables: attrs.variables,
      stateVersions: attrs["state-versions"],
      sentinelMocks: attrs["sentinel-mocks"],
      workspaceLocking: attrs["workspace-locking"],
      runTasks: attrs["run-tasks"],
      workspaceId: relationships.workspace?.data?.id ?? "",
      teamId: relationships.team?.data?.id ?? "",
    };
  },
};

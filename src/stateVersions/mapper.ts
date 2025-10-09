import { DomainMapper } from "../common/middleware/domainMapper";
import { StateVersionResource, StateVersion } from "./types";

export const stateVersionMapper: DomainMapper<
  StateVersionResource,
  StateVersion
> = {
  map(resource: StateVersionResource): StateVersion {
    const a = resource.attributes;
    return {
      id: resource.id,
      createdAt: a["created-at"],
      size: a.size,
      hostedJsonStateDownloadUrl: a["hosted-json-state-download-url"],
      hostedStateDownloadUrl: a["hosted-state-download-url"],
      hostedJsonStateUploadUrl: a["hosted-json-state-upload-url"],
      hostedStateUploadUrl: a["hosted-state-upload-url"],
      status: a.status,
      intermediate: a.intermediate,
      modules: a.modules,
      providers: a.providers,
      resources: a.resources,
      resourcesProcessed: a["resources-processed"],
      serial: a.serial,
      stateVersion: a["state-version"],
      terraformVersion: a["terraform-version"],
      vcsCommitSha: a["vcs-commit-sha"],
      vcsCommitUrl: a["vcs-commit-url"],
      run: resource.relationships?.run?.data,
      createdBy: resource.relationships?.["created-by"]?.data,
      workspace: resource.relationships?.workspace?.data,
    };
  },
};

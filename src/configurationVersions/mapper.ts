import { DomainMapper } from "../common/middleware/domainMapper";
import { ConfigurationVersion, ConfigurationVersionResource } from "./types";

export const configurationVersionMapper: DomainMapper<
  ConfigurationVersionResource,
  ConfigurationVersion
> = {
  map(resource: ConfigurationVersionResource): ConfigurationVersion {
    return {
      id: resource.id,
      autoQueueRuns: resource.attributes["auto-queue-runs"],
      error: resource.attributes.error,
      errorMessage: resource.attributes["error-message"],
      provisional: resource.attributes.provisional,
      source: resource.attributes.source,
      speculative: resource.attributes.speculative,
      status: resource.attributes.status,
      statusTimestamps: {
        archivedAt: resource.attributes["status-timestamps"]?.["archived-at"],
        fetchingAt: resource.attributes["status-timestamps"]?.["fetching-at"],
        uploadedAt: resource.attributes["status-timestamps"]?.["uploaded-at"],
      },
      changedFiles: resource.attributes["changed-files"],
      ingressAttributesId:
        resource.relationships?.["ingress-attributes"]?.data?.id,
      downloadUrl: resource.links?.download
        ? resource.links.download.replace(/^\/api\/v2/, "")
        : undefined,
    };
  },
};

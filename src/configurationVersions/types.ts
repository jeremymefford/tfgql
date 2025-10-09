import {
  BooleanComparisonExp,
  DateTimeComparisonExp,
  StringComparisonExp,
  WhereClause,
} from "../common/filtering/types";
import { ResourceObject, SingleResponse } from "../common/types/jsonApi";

export interface ConfigurationVersionAttributes {
  "auto-queue-runs": boolean;
  error: string | null;
  "error-message": string | null;
  provisional: boolean;
  source: string | null;
  speculative: boolean;
  status: string;
  "status-timestamps": {
    "archived-at"?: Date;
    "fetching-at"?: Date;
    "uploaded-at"?: Date;
  };
  "changed-files": string[];
}

export interface ConfigurationVersionRelationships {
  "ingress-attributes"?: {
    data: {
      id: string;
      type: string;
    };
  };
}

/**
 * Commit metadata for VCS-based configuration versions.
 */
export interface IngressAttributes {
  id: string;
  branch?: string;
  cloneUrl?: string;
  commitMessage?: string;
  commitSha?: string;
  commitUrl?: string;
  compareUrl?: string;
  identifier?: string;
  isPullRequest?: boolean;
  onDefaultBranch?: boolean;
  pullRequestNumber?: number;
  pullRequestUrl?: string;
  pullRequestTitle?: string;
  pullRequestBody?: string;
  tag?: string;
  senderUsername?: string;
  senderAvatarUrl?: string;
  senderHtmlUrl?: string;
  createdBy?: string;
}

export type ConfigurationVersionResource =
  ResourceObject<ConfigurationVersionAttributes> & {
    relationships?: ConfigurationVersionRelationships;
    links?: {
      download?: string;
    };
  };

export type ConfigurationVersionResponse =
  SingleResponse<ConfigurationVersionResource>;

export interface ConfigurationVersion {
  id: string;
  autoQueueRuns: boolean;
  error: string | null;
  errorMessage: string | null;
  provisional: boolean;
  source: string | null;
  speculative: boolean;
  status: string;
  statusTimestamps: {
    archivedAt?: Date;
    fetchingAt?: Date;
    uploadedAt?: Date;
  };
  changedFiles: string[];
  size?: number | null;
  downloadUrl?: string | null;
  ingressAttributesId?: string;
  ingressAttributes?: IngressAttributes;
}

export interface ConfigurationVersionStatusTimestampsFilter
  extends WhereClause<ConfigurationVersion["statusTimestamps"]> {
  _and?: ConfigurationVersionStatusTimestampsFilter[];
  _or?: ConfigurationVersionStatusTimestampsFilter[];
  _not?: ConfigurationVersionStatusTimestampsFilter;

  archivedAt?: DateTimeComparisonExp;
  fetchingAt?: DateTimeComparisonExp;
  uploadedAt?: DateTimeComparisonExp;
}

export interface ConfigurationVersionFilter
  extends WhereClause<
    ConfigurationVersion,
    {
      statusTimestamps: ConfigurationVersionStatusTimestampsFilter;
    }
  > {
  _and?: ConfigurationVersionFilter[];
  _or?: ConfigurationVersionFilter[];
  _not?: ConfigurationVersionFilter;

  id?: StringComparisonExp;
  autoQueueRuns?: BooleanComparisonExp;
  error?: StringComparisonExp;
  errorMessage?: StringComparisonExp;
  provisional?: BooleanComparisonExp;
  source?: StringComparisonExp;
  speculative?: BooleanComparisonExp;
  status?: StringComparisonExp;
  changedFiles?: StringComparisonExp;
  statusTimestamps?: ConfigurationVersionStatusTimestampsFilter;
}

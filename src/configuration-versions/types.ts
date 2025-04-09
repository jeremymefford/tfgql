import { ResourceObject, SingleResponse } from '../common/types/jsonApi';

export interface ConfigurationVersionAttributes {
  'auto-queue-runs': boolean;
  error: string | null;
  'error-message': string | null;
  provisional: boolean;
  source: string | null;
  speculative: boolean;
  status: string;
  'status-timestamps': {
    'archived-at'?: Date;
    'fetching-at'?: Date;
    'uploaded-at'?: Date;
  };
  'changed-files': string[];
}

export interface ConfigurationVersionRelationships {
  'ingress-attributes'?: {
    data: {
      id: string;
      type: string;
    };
  };
}

export type ConfigurationVersionResource = ResourceObject<ConfigurationVersionAttributes> & {
  relationships?: ConfigurationVersionRelationships;
};

export type ConfigurationVersionResponse = SingleResponse<ConfigurationVersionResource>;

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
  ingressAttributesId?: string;
}

export interface MetricDefinition {
  /** Prometheus metric name (e.g. "tfgql_workspace_resource_count") */
  name: string;
  /** HELP description */
  help: string;
  /** gauge | counter | info  (default: gauge) */
  type: "gauge" | "counter" | "info";
  /** GraphQL query string to execute */
  query: string;
  /** Optional GraphQL variables */
  variables?: Record<string, unknown>;
  /**
   * Dot-path into the query result to reach the array of rows.
   * Supports `[]` for array flattening, e.g. "agentPools[].agents"
   */
  resultPath: string;
  /**
   * Field name within each row that holds the numeric metric value.
   * Ignored for type: "info".
   */
  valueField: string;
  /**
   * Fields to use as Prometheus labels.
   * Keys are label names, values are dot-paths into the row object.
   * e.g. { organization: "organization.name", workspace: "name" }
   */
  labels: Record<string, string>;
}

export interface MetricSample {
  name: string;
  labels: Record<string, string>;
  value: number;
  timestamp?: number;
}

export interface RenderedMetricFamily {
  name: string;
  help: string;
  type: "gauge" | "counter" | "info";
  samples: MetricSample[];
}

export interface PrometheusConfig {
  metrics: MetricDefinition[];
  defaultVariables?: Record<string, unknown>;
}

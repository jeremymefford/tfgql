import { readFileSync } from "fs";
import { logger } from "../common/logger";
import type { MetricDefinition, PrometheusConfig } from "./types";
import { defaultMetricDefinitions } from "./defaults";

const VALID_METRIC_TYPES = new Set(["gauge", "counter", "info"]);
const METRIC_NAME_RE = /^[a-zA-Z_:][a-zA-Z0-9_:]*$/;

function validateDefinition(def: unknown, index: number): MetricDefinition {
  if (def == null || typeof def !== "object") {
    throw new Error(`metrics[${index}]: must be an object`);
  }
  const d = def as Record<string, unknown>;

  if (typeof d.name !== "string" || !METRIC_NAME_RE.test(d.name)) {
    throw new Error(
      `metrics[${index}]: "name" must be a valid Prometheus metric name`,
    );
  }
  if (typeof d.help !== "string" || d.help.length === 0) {
    throw new Error(`metrics[${index}]: "help" is required`);
  }

  const type = (d.type as string) ?? "gauge";
  if (!VALID_METRIC_TYPES.has(type)) {
    throw new Error(
      `metrics[${index}]: "type" must be gauge, counter, or info`,
    );
  }

  if (typeof d.query !== "string" || d.query.length === 0) {
    throw new Error(`metrics[${index}]: "query" is required`);
  }
  if (typeof d.resultPath !== "string" || d.resultPath.length === 0) {
    throw new Error(`metrics[${index}]: "resultPath" is required`);
  }

  if (type !== "info") {
    if (typeof d.valueField !== "string" || d.valueField.length === 0) {
      throw new Error(
        `metrics[${index}]: "valueField" is required for type "${type}"`,
      );
    }
  }

  if (d.labels != null && typeof d.labels !== "object") {
    throw new Error(`metrics[${index}]: "labels" must be an object`);
  }

  const labels: Record<string, string> = {};
  if (d.labels && typeof d.labels === "object") {
    for (const [k, v] of Object.entries(d.labels as Record<string, unknown>)) {
      if (typeof v !== "string") {
        throw new Error(
          `metrics[${index}].labels["${k}"]: value must be a string path`,
        );
      }
      labels[k] = v;
    }
  }

  return {
    name: d.name as string,
    help: d.help as string,
    type: type as MetricDefinition["type"],
    query: d.query as string,
    variables: d.variables as Record<string, unknown> | undefined,
    resultPath: d.resultPath as string,
    valueField: (d.valueField as string) ?? "",
    labels,
  };
}

let cachedConfig: PrometheusConfig | null = null;

/**
 * Load metric definitions from the config file specified by TFGQL_METRICS_CONFIG,
 * falling back to built-in defaults if no config file is specified.
 */
export function loadMetricDefinitions(
  configPath?: string,
): PrometheusConfig {
  if (cachedConfig) return cachedConfig;

  const path = configPath ?? process.env.TFGQL_METRICS_CONFIG;

  if (!path) {
    cachedConfig = { metrics: defaultMetricDefinitions };
    return cachedConfig;
  }

  try {
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (!Array.isArray(parsed.metrics)) {
      throw new Error(`Config must contain a "metrics" array`);
    }

    const metrics = parsed.metrics.map((def: unknown, i: number) =>
      validateDefinition(def, i),
    );

    cachedConfig = {
      metrics,
      defaultVariables: parsed.defaultVariables as
        | Record<string, unknown>
        | undefined,
    };

    logger.info(
      { path, metricCount: metrics.length },
      "Loaded Prometheus metrics config",
    );

    return cachedConfig;
  } catch (error) {
    throw new Error(
      `Failed to load metrics config from ${path}: ${(error as Error).message}`,
    );
  }
}

/**
 * Clear the cached config. Useful for reloading on SIGHUP or in tests.
 */
export function clearMetricConfigCache(): void {
  cachedConfig = null;
}

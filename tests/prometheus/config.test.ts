import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, unlinkSync, mkdtempSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import {
  loadMetricDefinitions,
  clearMetricConfigCache,
} from "../../src/prometheus/config";

describe("loadMetricDefinitions", () => {
  let tempDir: string;

  beforeEach(() => {
    clearMetricConfigCache();
    tempDir = mkdtempSync(join(tmpdir(), "tfgql-metrics-test-"));
  });

  afterEach(() => {
    clearMetricConfigCache();
    delete process.env.TFGQL_METRICS_CONFIG;
  });

  it("returns default definitions when no config path is set", () => {
    const config = loadMetricDefinitions();
    expect(config.metrics.length).toBeGreaterThan(0);
    expect(config.metrics[0].name).toBe("tfgql_workspace_resource_count");
  });

  it("loads valid JSON config from path argument", () => {
    const configPath = join(tempDir, "metrics.json");
    const configData = {
      metrics: [
        {
          name: "custom_metric",
          help: "A custom metric",
          type: "gauge",
          query: "query { items { count } }",
          resultPath: "items",
          valueField: "count",
          labels: { name: "name" },
        },
      ],
    };
    writeFileSync(configPath, JSON.stringify(configData));

    const config = loadMetricDefinitions(configPath);
    expect(config.metrics).toHaveLength(1);
    expect(config.metrics[0].name).toBe("custom_metric");
  });

  it("loads config from TFGQL_METRICS_CONFIG env var", () => {
    const configPath = join(tempDir, "env-metrics.json");
    const configData = {
      metrics: [
        {
          name: "env_metric",
          help: "From env",
          type: "counter",
          query: "query { x { v } }",
          resultPath: "x",
          valueField: "v",
          labels: {},
        },
      ],
    };
    writeFileSync(configPath, JSON.stringify(configData));
    process.env.TFGQL_METRICS_CONFIG = configPath;

    const config = loadMetricDefinitions();
    expect(config.metrics[0].name).toBe("env_metric");
    expect(config.metrics[0].type).toBe("counter");
  });

  it("throws on invalid metric name", () => {
    const configPath = join(tempDir, "bad-name.json");
    writeFileSync(
      configPath,
      JSON.stringify({
        metrics: [
          {
            name: "123-bad!",
            help: "x",
            query: "q",
            resultPath: "r",
            valueField: "v",
            labels: {},
          },
        ],
      }),
    );

    expect(() => loadMetricDefinitions(configPath)).toThrow(
      "valid Prometheus metric name",
    );
  });

  it("throws on missing help", () => {
    const configPath = join(tempDir, "no-help.json");
    writeFileSync(
      configPath,
      JSON.stringify({
        metrics: [
          {
            name: "valid_name",
            help: "",
            query: "q",
            resultPath: "r",
            valueField: "v",
            labels: {},
          },
        ],
      }),
    );

    expect(() => loadMetricDefinitions(configPath)).toThrow('"help" is required');
  });

  it("throws on missing query", () => {
    const configPath = join(tempDir, "no-query.json");
    writeFileSync(
      configPath,
      JSON.stringify({
        metrics: [
          {
            name: "valid_name",
            help: "help",
            query: "",
            resultPath: "r",
            valueField: "v",
            labels: {},
          },
        ],
      }),
    );

    expect(() => loadMetricDefinitions(configPath)).toThrow('"query" is required');
  });

  it("throws on missing valueField for gauge type", () => {
    const configPath = join(tempDir, "no-value.json");
    writeFileSync(
      configPath,
      JSON.stringify({
        metrics: [
          {
            name: "valid_name",
            help: "help",
            type: "gauge",
            query: "q",
            resultPath: "r",
            valueField: "",
            labels: {},
          },
        ],
      }),
    );

    expect(() => loadMetricDefinitions(configPath)).toThrow(
      '"valueField" is required',
    );
  });

  it("allows empty valueField for info type", () => {
    const configPath = join(tempDir, "info.json");
    writeFileSync(
      configPath,
      JSON.stringify({
        metrics: [
          {
            name: "info_metric",
            help: "Info type",
            type: "info",
            query: "q",
            resultPath: "r",
            valueField: "",
            labels: { a: "b" },
          },
        ],
      }),
    );

    const config = loadMetricDefinitions(configPath);
    expect(config.metrics[0].type).toBe("info");
  });

  it("throws on invalid type", () => {
    const configPath = join(tempDir, "bad-type.json");
    writeFileSync(
      configPath,
      JSON.stringify({
        metrics: [
          {
            name: "valid_name",
            help: "help",
            type: "histogram",
            query: "q",
            resultPath: "r",
            valueField: "v",
            labels: {},
          },
        ],
      }),
    );

    expect(() => loadMetricDefinitions(configPath)).toThrow(
      "gauge, counter, or info",
    );
  });

  it("throws on non-existent config file", () => {
    expect(() => loadMetricDefinitions("/nonexistent/path.json")).toThrow(
      "Failed to load metrics config",
    );
  });

  it("throws on invalid JSON", () => {
    const configPath = join(tempDir, "invalid.json");
    writeFileSync(configPath, "not json at all");

    expect(() => loadMetricDefinitions(configPath)).toThrow(
      "Failed to load metrics config",
    );
  });

  it("defaults type to gauge when not specified", () => {
    const configPath = join(tempDir, "no-type.json");
    writeFileSync(
      configPath,
      JSON.stringify({
        metrics: [
          {
            name: "default_type",
            help: "No type",
            query: "q",
            resultPath: "r",
            valueField: "v",
            labels: {},
          },
        ],
      }),
    );

    const config = loadMetricDefinitions(configPath);
    expect(config.metrics[0].type).toBe("gauge");
  });

  it("caches config on repeated calls", () => {
    const config1 = loadMetricDefinitions();
    const config2 = loadMetricDefinitions();
    expect(config1).toBe(config2); // Same reference
  });
});

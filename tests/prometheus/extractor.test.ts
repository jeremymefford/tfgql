import { describe, it, expect } from "vitest";
import { extractSamples } from "../../src/prometheus/extractor";
import type { MetricDefinition } from "../../src/prometheus/types";

describe("extractSamples", () => {
  it("extracts flat object fields", () => {
    const definition: MetricDefinition = {
      name: "test_metric",
      help: "Test",
      type: "gauge",
      query: "",
      resultPath: "items",
      valueField: "count",
      labels: { name: "name" },
    };

    const result = {
      items: [
        { name: "alpha", count: 10 },
        { name: "beta", count: 20 },
      ],
    };

    const samples = extractSamples(definition, result);
    expect(samples).toHaveLength(2);
    expect(samples[0]).toEqual({
      name: "test_metric",
      labels: { name: "alpha" },
      value: 10,
    });
    expect(samples[1]).toEqual({
      name: "test_metric",
      labels: { name: "beta" },
      value: 20,
    });
  });

  it("resolves nested dot-paths for labels", () => {
    const definition: MetricDefinition = {
      name: "nested_metric",
      help: "Test nested",
      type: "gauge",
      query: "",
      resultPath: "workspaces",
      valueField: "resourceCount",
      labels: {
        organization: "organization.name",
        workspace: "name",
      },
    };

    const result = {
      workspaces: [
        {
          name: "networking",
          resourceCount: 142,
          organization: { name: "my-org" },
        },
      ],
    };

    const samples = extractSamples(definition, result);
    expect(samples).toHaveLength(1);
    expect(samples[0].labels).toEqual({
      organization: "my-org",
      workspace: "networking",
    });
    expect(samples[0].value).toBe(142);
  });

  it("flattens arrays with [] in resultPath", () => {
    const definition: MetricDefinition = {
      name: "agent_info",
      help: "Agent status",
      type: "info",
      query: "",
      resultPath: "agentPools[].agents",
      valueField: "",
      labels: {
        organization: "__parent.organizationName",
        pool: "__parent.name",
        agent: "name",
        status: "status",
      },
    };

    const result = {
      agentPools: [
        {
          name: "pool-1",
          organizationName: "org-a",
          agents: [
            { name: "worker-1", status: "idle" },
            { name: "worker-2", status: "busy" },
          ],
        },
        {
          name: "pool-2",
          organizationName: "org-b",
          agents: [{ name: "worker-3", status: "idle" }],
        },
      ],
    };

    const samples = extractSamples(definition, result);
    expect(samples).toHaveLength(3);
    expect(samples[0].labels).toEqual({
      organization: "org-a",
      pool: "pool-1",
      agent: "worker-1",
      status: "idle",
    });
    expect(samples[1].labels.agent).toBe("worker-2");
    expect(samples[2].labels.organization).toBe("org-b");
    // info type always has value 1
    expect(samples[0].value).toBe(1);
  });

  it("skips rows with null/undefined value fields", () => {
    const definition: MetricDefinition = {
      name: "nullable_metric",
      help: "May be null",
      type: "gauge",
      query: "",
      resultPath: "items",
      valueField: "count",
      labels: { name: "name" },
    };

    const result = {
      items: [
        { name: "has-value", count: 5 },
        { name: "null-value", count: null },
        { name: "missing-value" },
        { name: "has-value-too", count: 0 },
      ],
    };

    const samples = extractSamples(definition, result);
    expect(samples).toHaveLength(2);
    expect(samples[0].value).toBe(5);
    expect(samples[1].value).toBe(0);
  });

  it("converts booleans to 0/1", () => {
    const definition: MetricDefinition = {
      name: "bool_metric",
      help: "Boolean test",
      type: "gauge",
      query: "",
      resultPath: "items",
      valueField: "locked",
      labels: { name: "name" },
    };

    const result = {
      items: [
        { name: "locked-ws", locked: true },
        { name: "unlocked-ws", locked: false },
      ],
    };

    const samples = extractSamples(definition, result);
    expect(samples).toHaveLength(2);
    expect(samples[0].value).toBe(1);
    expect(samples[1].value).toBe(0);
  });

  it("omits labels whose resolved value is null/undefined", () => {
    const definition: MetricDefinition = {
      name: "partial_labels",
      help: "Some labels missing",
      type: "gauge",
      query: "",
      resultPath: "items",
      valueField: "count",
      labels: {
        name: "name",
        optional: "optionalField",
      },
    };

    const result = {
      items: [
        { name: "with-optional", count: 1, optionalField: "yes" },
        { name: "without-optional", count: 2 },
      ],
    };

    const samples = extractSamples(definition, result);
    expect(samples).toHaveLength(2);
    expect(samples[0].labels).toEqual({ name: "with-optional", optional: "yes" });
    expect(samples[1].labels).toEqual({ name: "without-optional" });
  });

  it("converts non-string label values to strings", () => {
    const definition: MetricDefinition = {
      name: "coerce_labels",
      help: "Label coercion",
      type: "gauge",
      query: "",
      resultPath: "items",
      valueField: "count",
      labels: { name: "name", num: "numField", bool: "boolField" },
    };

    const result = {
      items: [{ name: "test", count: 1, numField: 42, boolField: true }],
    };

    const samples = extractSamples(definition, result);
    expect(samples[0].labels).toEqual({
      name: "test",
      num: "42",
      bool: "true",
    });
  });

  it("returns empty array for empty result", () => {
    const definition: MetricDefinition = {
      name: "empty_metric",
      help: "Empty",
      type: "gauge",
      query: "",
      resultPath: "items",
      valueField: "count",
      labels: {},
    };

    expect(extractSamples(definition, { items: [] })).toEqual([]);
    expect(extractSamples(definition, {})).toEqual([]);
    expect(extractSamples(definition, { other: [1] })).toEqual([]);
  });

  it("handles numeric string values", () => {
    const definition: MetricDefinition = {
      name: "string_num",
      help: "String number",
      type: "gauge",
      query: "",
      resultPath: "items",
      valueField: "val",
      labels: {},
    };

    const result = { items: [{ val: "123.45" }] };
    const samples = extractSamples(definition, result);
    expect(samples).toHaveLength(1);
    expect(samples[0].value).toBe(123.45);
  });

  it("skips non-numeric string values", () => {
    const definition: MetricDefinition = {
      name: "bad_num",
      help: "Not a number",
      type: "gauge",
      query: "",
      resultPath: "items",
      valueField: "val",
      labels: {},
    };

    const result = { items: [{ val: "not-a-number" }] };
    const samples = extractSamples(definition, result);
    expect(samples).toHaveLength(0);
  });
});

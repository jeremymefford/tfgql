import { describe, it, expect } from "vitest";
import {
  renderExposition,
  sanitizeName,
  escapeLabelValue,
} from "../../src/prometheus/renderer";
import type { RenderedMetricFamily } from "../../src/prometheus/types";

describe("sanitizeName", () => {
  it("passes through valid names", () => {
    expect(sanitizeName("tfgql_workspace_count")).toBe(
      "tfgql_workspace_count",
    );
  });

  it("replaces invalid characters with underscore", () => {
    expect(sanitizeName("my-metric.name")).toBe("my_metric_name");
  });

  it("prepends underscore when starting with a digit", () => {
    expect(sanitizeName("123metric")).toBe("_123metric");
  });

  it("allows colons in metric names", () => {
    expect(sanitizeName("job:metric:rate")).toBe("job:metric:rate");
  });
});

describe("escapeLabelValue", () => {
  it("escapes backslashes", () => {
    expect(escapeLabelValue("a\\b")).toBe("a\\\\b");
  });

  it("escapes double quotes", () => {
    expect(escapeLabelValue('hello "world"')).toBe('hello \\"world\\"');
  });

  it("escapes newlines", () => {
    expect(escapeLabelValue("line1\nline2")).toBe("line1\\nline2");
  });

  it("handles combined escapes", () => {
    expect(escapeLabelValue('a\\b\n"c"')).toBe('a\\\\b\\n\\"c\\"');
  });

  it("passes through simple strings", () => {
    expect(escapeLabelValue("simple")).toBe("simple");
  });
});

describe("renderExposition", () => {
  it("renders a single gauge family", () => {
    const families: RenderedMetricFamily[] = [
      {
        name: "tfgql_workspace_resource_count",
        help: "Number of resources",
        type: "gauge",
        samples: [
          {
            name: "tfgql_workspace_resource_count",
            labels: { organization: "my-org", workspace: "networking" },
            value: 142,
          },
          {
            name: "tfgql_workspace_resource_count",
            labels: { organization: "my-org", workspace: "compute" },
            value: 87,
          },
        ],
      },
    ];

    const result = renderExposition(families);
    expect(result).toBe(
      [
        "# HELP tfgql_workspace_resource_count Number of resources",
        "# TYPE tfgql_workspace_resource_count gauge",
        'tfgql_workspace_resource_count{organization="my-org",workspace="networking"} 142',
        'tfgql_workspace_resource_count{organization="my-org",workspace="compute"} 87',
        "",
      ].join("\n"),
    );
  });

  it("renders multiple families", () => {
    const families: RenderedMetricFamily[] = [
      {
        name: "metric_a",
        help: "First metric",
        type: "gauge",
        samples: [{ name: "metric_a", labels: {}, value: 1 }],
      },
      {
        name: "metric_b",
        help: "Second metric",
        type: "counter",
        samples: [{ name: "metric_b", labels: { env: "prod" }, value: 42 }],
      },
    ];

    const result = renderExposition(families);
    expect(result).toContain("# TYPE metric_a gauge");
    expect(result).toContain("# TYPE metric_b counter");
    expect(result).toContain("metric_a 1");
    expect(result).toContain('metric_b{env="prod"} 42');
  });

  it("skips empty families", () => {
    const families: RenderedMetricFamily[] = [
      {
        name: "empty_metric",
        help: "No samples",
        type: "gauge",
        samples: [],
      },
      {
        name: "has_data",
        help: "Has data",
        type: "gauge",
        samples: [{ name: "has_data", labels: {}, value: 5 }],
      },
    ];

    const result = renderExposition(families);
    expect(result).not.toContain("empty_metric");
    expect(result).toContain("has_data 5");
  });

  it("returns empty string for no families with data", () => {
    expect(renderExposition([])).toBe("");
    expect(
      renderExposition([
        { name: "x", help: "x", type: "gauge", samples: [] },
      ]),
    ).toBe("");
  });

  it("escapes label values properly", () => {
    const families: RenderedMetricFamily[] = [
      {
        name: "test_metric",
        help: "Test",
        type: "gauge",
        samples: [
          {
            name: "test_metric",
            labels: { path: '/a/"b"\\c' },
            value: 1,
          },
        ],
      },
    ];

    const result = renderExposition(families);
    expect(result).toContain('path="/a/\\"b\\"\\\\c"');
  });

  it("renders info type", () => {
    const families: RenderedMetricFamily[] = [
      {
        name: "agent_info",
        help: "Agent info",
        type: "info",
        samples: [
          {
            name: "agent_info",
            labels: { agent: "worker-1", status: "idle" },
            value: 1,
          },
        ],
      },
    ];

    const result = renderExposition(families);
    expect(result).toContain("# TYPE agent_info info");
    expect(result).toContain(
      'agent_info{agent="worker-1",status="idle"} 1',
    );
  });

  it("renders samples without labels", () => {
    const families: RenderedMetricFamily[] = [
      {
        name: "simple",
        help: "A simple metric",
        type: "gauge",
        samples: [{ name: "simple", labels: {}, value: 99 }],
      },
    ];

    const result = renderExposition(families);
    expect(result).toContain("simple 99");
    expect(result).not.toContain("{");
  });

  it("includes timestamp when provided", () => {
    const families: RenderedMetricFamily[] = [
      {
        name: "ts_metric",
        help: "With timestamp",
        type: "gauge",
        samples: [
          { name: "ts_metric", labels: {}, value: 42, timestamp: 1234567890 },
        ],
      },
    ];

    const result = renderExposition(families);
    expect(result).toContain("ts_metric 42 1234567890");
  });
});

import type { RenderedMetricFamily, MetricSample } from "./types";

/**
 * Sanitize a metric or label name to conform to Prometheus naming rules.
 * Must match [a-zA-Z_:][a-zA-Z0-9_:]* for metrics, [a-zA-Z_][a-zA-Z0-9_]* for labels.
 */
export function sanitizeName(name: string): string {
  let sanitized = name.replace(/[^a-zA-Z0-9_:]/g, "_");
  if (!/^[a-zA-Z_:]/.test(sanitized)) {
    sanitized = "_" + sanitized;
  }
  return sanitized;
}

/**
 * Escape a label value per Prometheus text exposition format.
 * Backslash, double-quote, and newline must be escaped.
 */
export function escapeLabelValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

/**
 * Format a single metric sample line: metric_name{labels} value
 */
function formatSample(sample: MetricSample): string {
  const labelPairs = Object.entries(sample.labels);
  const labelStr =
    labelPairs.length > 0
      ? `{${labelPairs.map(([k, v]) => `${sanitizeName(k)}="${escapeLabelValue(v)}"`).join(",")}}`
      : "";
  const ts = sample.timestamp != null ? ` ${sample.timestamp}` : "";
  return `${sanitizeName(sample.name)}${labelStr} ${sample.value}${ts}`;
}

/**
 * Render a full Prometheus text exposition document from metric families.
 */
export function renderExposition(families: RenderedMetricFamily[]): string {
  const lines: string[] = [];

  for (const family of families) {
    if (family.samples.length === 0) continue;

    const name = sanitizeName(family.name);
    lines.push(`# HELP ${name} ${family.help}`);
    lines.push(`# TYPE ${name} ${family.type}`);

    for (const sample of family.samples) {
      lines.push(formatSample(sample));
    }
  }

  return lines.length > 0 ? lines.join("\n") + "\n" : "";
}

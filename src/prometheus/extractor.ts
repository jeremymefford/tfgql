import type { MetricDefinition, MetricSample } from "./types";

/**
 * Resolve a dot-path like "organization.name" against an object.
 */
function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  let current: unknown = obj;
  for (const segment of path.split(".")) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

/**
 * Resolve a resultPath that may contain `[]` for array flattening.
 * e.g. "agentPools[].agents" walks into agentPools array, then flatMaps each .agents.
 * Returns flat array of row objects, each optionally carrying a `__parent` reference.
 */
function resolveResultPath(
  data: Record<string, unknown>,
  resultPath: string,
): Array<Record<string, unknown>> {
  const parts = resultPath.split("[]");

  if (parts.length === 1) {
    // No array flattening — simple dot-path to an array
    const result = resolvePath(data, resultPath);
    return Array.isArray(result) ? result : [];
  }

  // Walk through each segment, flattening arrays at each []
  let current: unknown[] = [data];

  for (let i = 0; i < parts.length; i++) {
    const segment = parts[i].replace(/^\./, "").replace(/\.$/, "");
    if (!segment && i === 0) {
      // resultPath starts with "[]" — unusual, treat data itself as array
      current = Array.isArray(data) ? data : [data];
      continue;
    }

    const next: unknown[] = [];
    for (const item of current) {
      if (item == null || typeof item !== "object") continue;
      const resolved = segment
        ? resolvePath(item as Record<string, unknown>, segment)
        : item;
      if (Array.isArray(resolved)) {
        // Wrap each child with a __parent reference without mutating the original
        for (const child of resolved) {
          if (child != null && typeof child === "object") {
            next.push({ ...(child as Record<string, unknown>), __parent: item });
          } else {
            next.push(child);
          }
        }
      } else if (resolved != null) {
        next.push(resolved);
      }
    }
    current = next;
  }

  return current.filter(
    (item): item is Record<string, unknown> =>
      item != null && typeof item === "object",
  );
}

/**
 * Convert a value to a numeric metric value.
 * Booleans become 0/1. Strings that look numeric are parsed.
 * Returns null if the value cannot be converted.
 */
function toNumericValue(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "string") {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }
  return null;
}

/**
 * Extract metric samples from a GraphQL query result based on a MetricDefinition.
 */
export function extractSamples(
  definition: MetricDefinition,
  queryResult: Record<string, unknown>,
): MetricSample[] {
  const rows = resolveResultPath(queryResult, definition.resultPath);
  const samples: MetricSample[] = [];

  for (const row of rows) {
    // Resolve value
    let value: number;
    if (definition.type === "info") {
      value = 1;
    } else {
      const rawValue = definition.valueField
        ? resolvePath(row, definition.valueField)
        : undefined;
      const numericValue = toNumericValue(rawValue);
      if (numericValue == null) continue; // Skip rows with non-numeric values
      value = numericValue;
    }

    // Resolve labels
    const labels: Record<string, string> = {};
    for (const [labelName, labelPath] of Object.entries(definition.labels)) {
      const rawLabel = resolvePath(row, labelPath);
      if (rawLabel == null) continue; // Omit null/undefined labels
      labels[labelName] =
        typeof rawLabel === "string" ? rawLabel : String(rawLabel);
    }

    samples.push({
      name: definition.name,
      labels,
      value,
    });
  }

  return samples;
}

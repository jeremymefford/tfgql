import type { ApolloServer } from "@apollo/server";
import type { Context } from "../server/context";
import type { MetricDefinition, RenderedMetricFamily } from "./types";
import { loadMetricDefinitions } from "./config";
import { extractSamples } from "./extractor";
import { renderExposition } from "./renderer";

let apolloServerRef: ApolloServer<Context> | null = null;

/**
 * Store a reference to the running ApolloServer so resolvers
 * can call executeOperation for metric queries.
 */
export function setApolloServer(server: ApolloServer<Context>): void {
  apolloServerRef = server;
}

interface MetricsArgs {
  format?: "PROMETHEUS" | "OPENMETRICS";
  names?: string[];
  includeOrgs?: string[];
  excludeOrgs?: string[];
}

interface MetricFromQueryArgs {
  name: string;
  help?: string;
  type?: string;
  query: string;
  variables?: Record<string, unknown>;
  resultPath: string;
  valueField: string;
  labels: Record<string, string>;
  format?: "PROMETHEUS" | "OPENMETRICS";
}

async function executeMetricQuery(
  definition: MetricDefinition,
  ctx: Context,
): Promise<RenderedMetricFamily> {
  const server = apolloServerRef;
  if (!server) {
    throw new Error("ApolloServer not initialized for metrics");
  }

  const variables = { ...definition.variables };

  const result = await server.executeOperation(
    {
      query: definition.query,
      variables,
    },
    { contextValue: ctx },
  );

  if (result.body.kind !== "single") {
    throw new Error(`Metric query "${definition.name}" returned unexpected response kind`);
  }

  const { data, errors } = result.body.singleResult;

  if (errors && errors.length > 0) {
    ctx.logger.warn(
      { metric: definition.name, errors },
      "Metric query returned errors",
    );
  }

  const samples = data
    ? extractSamples(definition, data as Record<string, unknown>)
    : [];

  return {
    name: definition.name,
    help: definition.help,
    type: definition.type,
    samples,
  };
}

export const resolvers = {
  Query: {
    metrics: async (
      _: unknown,
      args: MetricsArgs,
      ctx: Context,
    ) => {
      const config = loadMetricDefinitions();
      let definitions = config.metrics;

      if (args.names && args.names.length > 0) {
        const nameSet = new Set(args.names);
        definitions = definitions.filter((d) => nameSet.has(d.name));
      }

      // Inject org scope into variables if provided
      if (args.includeOrgs || args.excludeOrgs) {
        definitions = definitions.map((d) => ({
          ...d,
          variables: {
            ...d.variables,
            ...(args.includeOrgs ? { orgs: args.includeOrgs } : {}),
          },
        }));
      }

      const families = await Promise.all(
        definitions.map((def) => executeMetricQuery(def, ctx)),
      );

      const allSamples = families.flatMap((f) => f.samples);
      const text = renderExposition(families);

      return {
        text,
        samples: allSamples.map((s) => ({
          name: s.name,
          labels: s.labels,
          value: s.value,
        })),
        familyCount: families.filter((f) => f.samples.length > 0).length,
        sampleCount: allSamples.length,
      };
    },

    metricFromQuery: async (
      _: unknown,
      args: MetricFromQueryArgs,
      ctx: Context,
    ) => {
      const type = (args.type ?? "gauge") as MetricDefinition["type"];
      if (!["gauge", "counter", "info"].includes(type)) {
        throw new Error(`Invalid metric type: ${args.type}`);
      }

      const definition: MetricDefinition = {
        name: args.name,
        help: args.help ?? "",
        type,
        query: args.query,
        variables: args.variables,
        resultPath: args.resultPath,
        valueField: args.valueField,
        labels: args.labels,
      };

      const family = await executeMetricQuery(definition, ctx);
      const text = renderExposition([family]);

      return {
        text,
        samples: family.samples.map((s) => ({
          name: s.name,
          labels: s.labels,
          value: s.value,
        })),
        familyCount: family.samples.length > 0 ? 1 : 0,
        sampleCount: family.samples.length,
      };
    },
  },
};

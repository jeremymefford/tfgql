import type { ApolloServer } from "@apollo/server";
import type { FastifyInstance } from "fastify";
import type { Context } from "./context";
import { buildContext } from "./context";
import { loadMetricDefinitions } from "../prometheus/config";
import { extractSamples } from "../prometheus/extractor";
import { renderExposition } from "../prometheus/renderer";
import type { RenderedMetricFamily } from "../prometheus/types";
import { verifyJwt } from "../common/auth/tokenService";
import {
  enterLogContext,
  updateLogContext,
  logger,
} from "../common/logger";
import {
  parseTraceparent,
  generateTraceId,
  generateSpanId,
  formatTraceparent,
} from "../common/trace";
import { applicationConfiguration } from "../common/conf";

const PROMETHEUS_CONTENT_TYPE =
  "text/plain; version=0.0.4; charset=utf-8";

/** Per-token cache for rendered exposition text */
const metricsCache = new Map<
  string,
  { text: string; expiresAt: number }
>();

const MAX_CACHE_ENTRIES = 100;

/** Global in-flight promise — only one metrics collection runs at a time. */
let inflightCollection: Promise<{ text: string; durationMs: number }> | null =
  null;

/** Dynamic cache TTL override (in ms) when processing exceeds configured TTL */
let adaptiveCacheTtlMs: number | null = null;

/** Last observed metrics processing duration in seconds */
let lastMetricsDurationSeconds: number = 0;

function getEffectiveCacheTtlMs(): number {
  const configuredMs = applicationConfiguration.metricsCacheTtlSeconds * 1000;
  return adaptiveCacheTtlMs != null
    ? Math.max(adaptiveCacheTtlMs, configuredMs)
    : configuredMs;
}

/** Remove expired entries and enforce size cap. */
function evictStaleEntries(): void {
  const now = Date.now();
  for (const [key, entry] of metricsCache) {
    if (entry.expiresAt <= now) metricsCache.delete(key);
  }
  // If still over the cap, drop oldest entries first
  if (metricsCache.size > MAX_CACHE_ENTRIES) {
    const excess = metricsCache.size - MAX_CACHE_ENTRIES;
    const keys = metricsCache.keys();
    for (let i = 0; i < excess; i++) {
      const k = keys.next().value;
      if (k !== undefined) metricsCache.delete(k);
    }
  }
}

export function registerMetricsRoute(
  fastify: FastifyInstance<any>,
  apolloServer: ApolloServer<Context>,
): void {
  fastify.get(
    "/metrics",
    async (request, reply) => {
      // --- trace context ---
      const traceHeader =
        (request.headers["traceparent"] as string | undefined) ?? undefined;
      const incoming = parseTraceparent(traceHeader);
      const traceId = incoming?.traceId ?? generateTraceId();
      const spanId = generateSpanId();
      const traceFlags = incoming?.traceFlags ?? "01";
      const traceparent = formatTraceparent(traceId, spanId, traceFlags);

      reply.header("x-request-id", traceparent);
      reply.header("traceparent", traceparent);

      enterLogContext({
        requestId: traceparent,
        traceId,
        spanId,
        traceFlags,
        traceparent,
      });

      // --- authenticate ---
      const rawAuth = request.headers.authorization;
      const authHeader = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;

      if (
        typeof authHeader !== "string" ||
        !authHeader.toLowerCase().startsWith("bearer ")
      ) {
        reply.code(401);
        return { error: "Missing Authorization header" };
      }

      const token = authHeader.slice(7).trim();
      if (!token) {
        reply.code(401);
        return { error: "Invalid Authorization header" };
      }

      let verifiedClaims;
      try {
        verifiedClaims = await verifyJwt(token);
      } catch {
        reply.code(401);
        return { error: "Invalid or expired token" };
      }

      updateLogContext({ tokenHash: verifiedClaims.tokenHash });

      // --- check cache ---
      const cacheTtl = getEffectiveCacheTtlMs();
      const cacheKey = verifiedClaims.tokenHash;
      const cached = metricsCache.get(cacheKey);
      if (cached) {
        if (cached.expiresAt > Date.now()) {
          reply.type(PROMETHEUS_CONTENT_TYPE);
          return cached.text;
        }
        metricsCache.delete(cacheKey);
      }

      // --- coalesce all concurrent requests behind a single global collection ---
      if (!inflightCollection) {
        inflightCollection = collectMetrics(
          apolloServer,
          verifiedClaims.tfcToken,
        ).finally(() => {
          inflightCollection = null;
        });
      }

      const { text, durationMs } = await inflightCollection;

      // --- adapt cache TTL if processing is slower than configured TTL ---
      const configuredTtlMs =
        applicationConfiguration.metricsCacheTtlSeconds * 1000;
      if (durationMs > configuredTtlMs) {
        const newTtl = Math.ceil(durationMs * 1.2);
        if (adaptiveCacheTtlMs == null || newTtl !== adaptiveCacheTtlMs) {
          logger.warn(
            {
              durationMs,
              configuredTtlMs,
              adaptiveCacheTtlMs: newTtl,
            },
            "Metrics collection slower than cache TTL, adapting TTL to 120% of processing time",
          );
        }
        adaptiveCacheTtlMs = newTtl;
      } else {
        adaptiveCacheTtlMs = null;
      }

      // --- append self-metric for processing duration ---
      const selfMetric = renderExposition([
        {
          name: "tfgql_metrics_collection_duration_seconds",
          help: "Time taken to collect and render all metrics",
          type: "gauge",
          samples: [
            {
              name: "tfgql_metrics_collection_duration_seconds",
              labels: {},
              value: lastMetricsDurationSeconds,
            },
          ],
        },
      ]);
      const fullText = text + selfMetric;

      // --- cache result ---
      const effectiveTtl = getEffectiveCacheTtlMs();
      if (effectiveTtl > 0) {
        evictStaleEntries();
        metricsCache.set(cacheKey, {
          text: fullText,
          expiresAt: Date.now() + effectiveTtl,
        });
      }

      reply.type(PROMETHEUS_CONTENT_TYPE);
      return fullText;
    },
  );
}

async function collectMetrics(
  apolloServer: ApolloServer<Context>,
  tfcToken: string,
): Promise<{ text: string; durationMs: number }> {
  const startTime = performance.now();
  const requestLogger = logger;
  const ctx = await buildContext(requestLogger, tfcToken);

  const config = loadMetricDefinitions();
  const families: RenderedMetricFamily[] = [];

  for (const definition of config.metrics) {
    try {
      const result = await apolloServer.executeOperation(
        {
          query: definition.query,
          variables: { ...definition.variables },
        },
        { contextValue: ctx },
      );

      if (result.body.kind !== "single") continue;

      const { data, errors } = result.body.singleResult;
      if (errors && errors.length > 0) {
        requestLogger.warn(
          { metric: definition.name, errors },
          "Metric query returned errors",
        );
      }

      const samples = data
        ? extractSamples(
            definition,
            data as Record<string, unknown>,
          )
        : [];

      families.push({
        name: definition.name,
        help: definition.help,
        type: definition.type,
        samples,
      });
    } catch (error) {
      requestLogger.error(
        { metric: definition.name, err: error },
        "Failed to execute metric query",
      );
    }
  }

  const text = renderExposition(families);
  const durationMs = performance.now() - startTime;
  lastMetricsDurationSeconds = durationMs / 1000;

  return { text, durationMs };
}

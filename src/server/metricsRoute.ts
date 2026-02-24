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

function getCacheTtlMs(): number {
  return applicationConfiguration.metricsCacheTtlSeconds * 1000;
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
      const cacheTtl = getCacheTtlMs();
      const cacheKey = verifiedClaims.tokenHash;
      const cached = metricsCache.get(cacheKey);
      if (cached) {
        if (cached.expiresAt > Date.now()) {
          reply.type(PROMETHEUS_CONTENT_TYPE);
          return cached.text;
        }
        metricsCache.delete(cacheKey);
      }

      // --- build context and execute ---
      const requestLogger = logger;
      const ctx = await buildContext(requestLogger, verifiedClaims.tfcToken);

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

      // --- cache result ---
      if (cacheTtl > 0) {
        evictStaleEntries();
        metricsCache.set(cacheKey, {
          text,
          expiresAt: Date.now() + cacheTtl,
        });
      }

      reply.type(PROMETHEUS_CONTENT_TYPE);
      return text;
    },
  );
}

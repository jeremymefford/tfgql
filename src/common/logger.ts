import pino from "pino";
import { AsyncLocalStorage } from "node:async_hooks";

export type LogTraceContext = {
  traceId?: string;
  spanId?: string;
  traceFlags?: string;
  traceparent?: string;
  requestId?: string;
  tokenHash?: string;
};

// AsyncLocalStorage used to inject per-request context into every log line
export const logContext = new AsyncLocalStorage<LogTraceContext>();

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true, singleLine: true } }
      : undefined,
  base: { service: "tfce-graphql" },
  redact: ["req.headers.authorization", "password", "*.token"],
  // Add trace context to every log line if present
  mixin() {
    const ctx = logContext.getStore();
    if (!ctx) return {};
    const { traceId, tokenHash } = ctx;
    return {
      ...(traceId ? { trace_id: traceId } : {}),
      ...(tokenHash ? { token_hash: tokenHash } : {}),
    };
  },
});

/**
 * Run a function with the given log trace context bound so all logs inside it
 * automatically include the context via the pino mixin above.
 */
export function runWithLogContext<T>(ctx: LogTraceContext, fn: () => T): T {
  return logContext.run(ctx, fn);
}

/**
 * Enter the log context for the current async execution, affecting all future
 * async operations derived from here (useful at request start).
 */
export function enterLogContext(ctx: LogTraceContext): void {
  const current = logContext.getStore() ?? {};
  Object.assign(current, ctx);
  logContext.enterWith(current);
}

export function updateLogContext(ctx: Partial<LogTraceContext>): void {
  const current = logContext.getStore();
  if (current) {
    Object.assign(current, ctx);
    return;
  }
  logContext.enterWith({ ...ctx });
}

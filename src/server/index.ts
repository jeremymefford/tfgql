import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schema';
import { buildContext, Context } from './context';
import { createLoggingPlugin } from '../common/middleware/logging';
import { logger } from '../common/logger';
import { parseTraceparent, generateTraceId, generateSpanId, formatTraceparent } from '../common/trace';
import { enterLogContext } from '../common/logger';
import { ApolloArmor } from '@escape.tech/graphql-armor';

/**
 * Initialize and start the Apollo GraphQL server (standalone HTTP server).
 */
export async function startServer(): Promise<void> {
  const armor = new ApolloArmor({
    maxDepth: { n: 10 },
    maxAliases: { n: 20 },
    maxDirectives: { n: 50 },
    costLimit: { maxCost: 20000 }
  });
  const protection = armor.protect();

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [createLoggingPlugin(), ...protection.plugins],
    validationRules: protection.validationRules,
    includeStacktraceInErrorResponses: protection.includeStacktraceInErrorResponses,
    allowBatchedHttpRequests: protection.allowBatchedHttpRequests
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const incoming = parseTraceparent((req.headers['traceparent'] as string | undefined) || undefined);
      const traceId = incoming?.traceId ?? generateTraceId();
      // Create a span for this server request; parent is incoming span if any
      const spanId = generateSpanId();
      const traceFlags = incoming?.traceFlags ?? '01';
      const traceparent = formatTraceparent(traceId, spanId);

      // Use traceparent as the canonical request id
      const requestId = traceparent;
      // Bind AsyncLocalStorage context so all logs (even global logger) include trace fields
      enterLogContext({ requestId, traceId, spanId, traceFlags, traceparent });
      // Use base logger; mixin adds trace fields to every log line
      const requestLogger = logger;
      return buildContext(requestLogger);
    },
    listen: { port: Number(process.env.PORT) || 4000 }
  });

  logger.info({ url }, 'GraphQL server ready');
}

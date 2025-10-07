import { ApolloServer } from '@apollo/server';
import { ApolloArmor } from '@escape.tech/graphql-armor';
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import fastifyCors from '@fastify/cors';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import fastifyApollo from '@as-integrations/fastify';
import { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import { buildContext, Context } from './context';
import { typeDefs, resolvers } from './schema';
import { applicationConfiguration } from '../common/conf';
import { createLoggingPlugin } from '../common/middleware/logging';
import { enterLogContext, logger } from '../common/logger';
import { parseTraceparent, generateTraceId, generateSpanId, formatTraceparent } from '../common/trace';

/**
 * Initialize and start the Apollo GraphQL server (standalone HTTP/HTTPS server).
 */
export async function startServer(): Promise<void> {
  const disableExplorer = (process.env.TFCE_GRAPHQL_DISABLE_EXPLORER ?? '').toLowerCase() === 'true';

  const armor = new ApolloArmor({
    maxDepth: { n: 10 },
    maxAliases: { n: 20 },
    maxDirectives: { n: 50 },
    costLimit: { maxCost: 20000 },
  });
  const protection = armor.protect();

  const fastify = createFastifyInstance();

  await fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  const landingPagePlugin = disableExplorer
    ? ApolloServerPluginLandingPageDisabled()
    : ApolloServerPluginLandingPageLocalDefault({ embed: true });

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [
      createLoggingPlugin(),
      ...protection.plugins,
      landingPagePlugin,
      fastifyApolloDrainPlugin(fastify),
    ],
    validationRules: protection.validationRules,
    includeStacktraceInErrorResponses: protection.includeStacktraceInErrorResponses,
    allowBatchedHttpRequests: protection.allowBatchedHttpRequests,
  });

  await server.start();

  await fastify.register(fastifyApollo(server), {
    path: '/',
    context: async (request: FastifyRequest, reply: FastifyReply) =>
      buildFastifyContext(request, reply),
  });

  const port = Number(process.env.PORT) || 4000;
  const host = process.env.HOST;

  const address = await fastify.listen({ port, host });
  const isHttps = Boolean(applicationConfiguration.serverTlsConfig);

  if (isHttps) {
    logger.warn({ url: address }, 'GraphQL server ready with in-process TLS termination (HTTP/2); prefer upstream TLS termination for better performance');
  } else {
    logger.info({ url: address }, 'GraphQL server ready');
  }
}

function createFastifyInstance(): FastifyInstance<any> {
  const tlsConfig = applicationConfiguration.serverTlsConfig;
  if (!tlsConfig) {
    return Fastify({
      bodyLimit: 50 * 1024 * 1024,
    });
  }

  const { cert, key, ca, passphrase } = tlsConfig;
  return Fastify({
    http2: true,
    https: {
      allowHTTP1: true,
      cert,
      key,
      ca,
      passphrase,
      minVersion: 'TLSv1.3',
      maxVersion: 'TLSv1.3',
      ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256',
      honorCipherOrder: true,
      requestCert: false,
    },
    bodyLimit: 50 * 1024 * 1024,
  });
}

async function buildFastifyContext(request: FastifyRequest, reply: FastifyReply): Promise<Context> {
  const traceHeader = (request.headers['traceparent'] as string | undefined) ?? undefined;
  const incoming = parseTraceparent(traceHeader);
  const traceId = incoming?.traceId ?? generateTraceId();
  const spanId = generateSpanId();
  const traceFlags = incoming?.traceFlags ?? '01';
  const traceparent = formatTraceparent(traceId, spanId);

  const requestId = traceparent;
  enterLogContext({ requestId, traceId, spanId, traceFlags, traceparent });
  reply.header('x-request-id', requestId);
  reply.header('traceparent', traceparent);
  const requestLogger = logger;
  return buildContext(requestLogger);
}

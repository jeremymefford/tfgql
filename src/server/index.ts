import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloArmor } from '@escape.tech/graphql-armor';
import cors from 'cors';
import express, { json, type Express } from 'express';
import http from 'http';
import https from 'https';
import type { AddressInfo } from 'net';
import { format } from 'url';
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
  const armor = new ApolloArmor({
    maxDepth: { n: 10 },
    maxAliases: { n: 20 },
    maxDirectives: { n: 50 },
    costLimit: { maxCost: 20000 },
  });
  const protection = armor.protect();

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [createLoggingPlugin(), ...protection.plugins],
    validationRules: protection.validationRules,
    includeStacktraceInErrorResponses: protection.includeStacktraceInErrorResponses,
    allowBatchedHttpRequests: protection.allowBatchedHttpRequests,
  });

  const app = express();
  app.disable('x-powered-by');
  app.use(cors(), json({ limit: '50mb' }));

  const httpServer = createHttpServer(app);
  server.addPlugin(ApolloServerPluginDrainHttpServer({ httpServer }));

  await server.start();

  app.use(
    expressMiddleware(server, {
      context: async ({ req }) => {
        const incoming = parseTraceparent((req.headers['traceparent'] as string | undefined) || undefined);
        const traceId = incoming?.traceId ?? generateTraceId();
        const spanId = generateSpanId();
        const traceFlags = incoming?.traceFlags ?? '01';
        const traceparent = formatTraceparent(traceId, spanId);

        const requestId = traceparent;
        enterLogContext({ requestId, traceId, spanId, traceFlags, traceparent });
        const requestLogger = logger;
        return buildContext(requestLogger);
      },
    }),
  );

  const port = Number(process.env.PORT) || 4000;
  const host = process.env.HOST;

  await new Promise<void>((resolve) => {
    httpServer.listen({ port, host }, resolve);
  });

  const isHttps = Boolean(applicationConfiguration.serverTlsConfig);
  const url = buildServerUrl(httpServer, isHttps ? 'https' : 'http');

  if (isHttps) {
    logger.warn({ url }, 'GraphQL server ready with in-process TLS termination; prefer upstream TLS termination for better performance');
  } else {
    logger.info({ url }, 'GraphQL server ready');
  }
}

function createHttpServer(app: Express): http.Server | https.Server {
  const tlsConfig = applicationConfiguration.serverTlsConfig;
  if (!tlsConfig) {
    return http.createServer(app);
  }

  const { cert, key, ca, passphrase } = tlsConfig;

  return https.createServer(
    {
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
    app,
  );
}

function buildServerUrl(server: http.Server | https.Server, protocol: 'http' | 'https'): string {
  const address = server.address() as AddressInfo | null;
  if (!address) {
    return `${protocol}://localhost/`;
  }

  const hostname = address.address === '' || address.address === '::' ? 'localhost' : address.address;

  return format({
    protocol,
    hostname,
    port: address.port,
    pathname: '/',
  });
}

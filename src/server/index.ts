import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schema';
import { buildContext, Context } from './context';
import { loggingPlugin } from '../common/middleware/logging';

/**
 * Initialize and start the Apollo GraphQL server (standalone HTTP server).
 */
export async function startServer(): Promise<void> {
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [loggingPlugin]
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => buildContext(),
    listen: { port: Number(process.env.PORT) || 4000 }
  });

  console.log(`🚀 GraphQL server ready at ${url}`);
}
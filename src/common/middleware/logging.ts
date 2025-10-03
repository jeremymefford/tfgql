import { ApolloServerPlugin, GraphQLRequestContext } from '@apollo/server';
import type { Context } from '../../server/context';

/**
 * Apollo Server plugin to log GraphQL requests and errors.
 */
export function createLoggingPlugin(): ApolloServerPlugin<Context> {
  return {
    async requestDidStart(requestContext: GraphQLRequestContext<Context>) {
      const opName = requestContext.request.operationName || 'Anonymous';
      requestContext.contextValue?.logger?.info({ operationName: opName }, 'GraphQL request start');
      return {
        async willSendResponse(context) {
          if (context.errors && context.errors.length > 0) {
            context.contextValue?.logger?.error({ errors: context.errors }, 'GraphQL request errors');
          }
        }
      };
    }
  };
}

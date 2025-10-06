import { ApolloServerPlugin, GraphQLRequestContext } from '@apollo/server';
import type { Context } from '../../server/context';
import { logContext } from '../logger';

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
          try {
            const store = logContext.getStore();
            const headers = context.response?.http?.headers;
            if (headers) {
              if (store?.traceparent) {
                headers.set('traceparent', store.traceparent);
                headers.set('x-request-id', store.traceparent);
              } else if (store?.traceId) {
                headers.set('x-request-id', store.traceId);
              }
            }
          } catch {
            // ignore header set failures
          }
        }
      };
    }
  };
}

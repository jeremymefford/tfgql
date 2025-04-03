import { ApolloServerPlugin, GraphQLRequestContext } from '@apollo/server';

/**
 * Apollo Server plugin to log GraphQL requests and errors.
 */
export const loggingPlugin: ApolloServerPlugin = {
  async requestDidStart(requestContext: GraphQLRequestContext<Record<string, any>>) {
    console.log(`➡️  GraphQL request: ${requestContext.request.operationName || 'Anonymous'}`);
    return {
      async willSendResponse(context) {
        if (context.errors && context.errors.length > 0) {
          console.error('❗ GraphQL Errors:', context.errors);
        }
      }
    };
  }
};
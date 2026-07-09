import { combinedSchema, permissions } from '@axc/graphql';
import type { ServiceApolloServerOptions } from '@axc/service-apollo-server';

const { NODE_ENV } = process.env;
const isDev = NODE_ENV !== 'production';

/**
 * Apollo Server configuration for the API: the combined schema, permissions
 * middleware, introspection (dev only), batching, and a query-depth limit.
 */
export const apolloServerOptions: ServiceApolloServerOptions = {
	schema: combinedSchema,
	middleware: permissions,
	introspection: isDev,
	allowBatchedHttpRequests: true,
	maxDepth: 10,
};

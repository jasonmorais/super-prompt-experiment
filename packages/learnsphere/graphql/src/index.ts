// Application schema and resolvers.
export { combinedSchema } from './schema/builder/schema-builder.ts';
export { permissions, resolvers } from './schema/builder/resolver-builder.ts';

// GraphQL context type used by handlers, resolvers, and tests.
export type { GraphContext } from './schema/context.ts';

import type { IResolvers } from '@graphql-tools/utils';
import type { IMiddleware } from 'graphql-middleware';
import type { GraphContext } from '../context.ts';

/**
 * Application resolvers. The blank scaffold implements a single `health` query
 * for startup verification. Merge your per-type resolver modules here as the
 * schema grows.
 */
export const resolvers: IResolvers<unknown, GraphContext> = {
	Query: {
		health: (): string => 'ok',
	},
};

/**
 * `graphql-middleware` permissions applied over the schema. Empty in the blank
 * scaffold — add field-level authorization rules here.
 */
export const permissions: IMiddleware = {};

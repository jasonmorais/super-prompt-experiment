import { mergeResolvers } from '@graphql-tools/merge';
import type { IMiddleware } from 'graphql-middleware';
import coursesResolvers from '../types/courses.resolvers.ts';
import healthResolvers from '../types/health.resolvers.ts';
import type { Resolvers } from './generated.ts';

/**
 * Application resolvers, typed against the codegen-generated {@link Resolvers}
 * manifest. Each `types/*.resolvers.ts` module contributes its slice and they
 * are merged here. Mirrors the Community context's `resolver-builder.ts`.
 */
function mergeResolverModules(modules: Resolvers[]): Resolvers {
	return (modules.length === 0 ? {} : mergeResolvers(modules)) as Resolvers;
}

export const resolvers: Resolvers = mergeResolverModules([healthResolvers, coursesResolvers]);

/**
 * `graphql-middleware` permissions applied over the schema. Empty in the
 * scaffold — add field-level authorization rules here.
 */
export const permissions: IMiddleware = {};

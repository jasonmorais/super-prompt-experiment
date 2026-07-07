import { buildCellixSchema } from '@cellix/graphql-codegen';
import type { GraphQLSchema } from 'graphql';
import type { GraphContext } from '../context.ts';
import { resolvers } from './resolver-builder.ts';

/**
 * Application type definitions. Kept in sync with `schema/types/*.graphql`,
 * which the `graphql-codegen` pipeline consumes to generate resolver types. The
 * blank scaffold ships a single `health` query for startup verification.
 */
const applicationTypeDefs = /* GraphQL */ `
	extend type Query {
		health: String
	}
`;

/** The complete executable schema: base Cellix types plus application types. */
export const combinedSchema: GraphQLSchema = buildCellixSchema<GraphContext>([applicationTypeDefs], [resolvers]);

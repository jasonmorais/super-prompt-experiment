import { buildCellixSchema } from '@cellix/graphql-codegen';
import type { GraphQLSchema } from 'graphql';
import type { GraphContext } from '../context.ts';
import { resolvers } from './resolver-builder.ts';
import { axcGraphqlTypeDefs } from './schema-type-defs.generated.ts';

/**
 * The complete executable schema: base Cellix types plus the application SDL.
 * The application type definitions are generated from `schema/types/*.graphql`
 * (see `codegen.yml`), so the runtime schema and the codegen resolver types
 * share a single source of truth.
 */
export const combinedSchema: GraphQLSchema = buildCellixSchema<GraphContext>([...axcGraphqlTypeDefs], [resolvers]);

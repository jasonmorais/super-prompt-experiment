import { mergeResolvers } from '@graphql-tools/merge';
import type { Resolvers } from './generated.ts';
import { learnsphereGraphqlPermissions, learnsphereGraphqlResolvers } from './resolver-manifest.generated.ts';

const mergeResolverModules = (modules: Resolvers[]): Resolvers => (modules.length === 0 ? {} : mergeResolvers(modules)) as Resolvers;

export const resolvers: Resolvers = mergeResolverModules([...learnsphereGraphqlResolvers]);
export const permissions: Resolvers = mergeResolverModules(learnsphereGraphqlPermissions);

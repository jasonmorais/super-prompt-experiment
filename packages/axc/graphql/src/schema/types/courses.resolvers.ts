import type { GraphQLResolveInfo } from 'graphql';
import type { Resolvers } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';

const courses: Resolvers = {
	Query: {
		courses: async (_parent, _args, context: GraphContext, _info: GraphQLResolveInfo) => {
			return await context.applicationServices.courses.queryAll();
		},
	},
};

export default courses;

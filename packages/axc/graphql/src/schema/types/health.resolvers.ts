import type { Resolvers } from '../builder/generated.ts';

const health: Resolvers = {
	Query: {
		health: (): string => 'ok',
	},
};

export default health;

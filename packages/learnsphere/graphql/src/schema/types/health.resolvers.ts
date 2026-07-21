import type { Resolvers } from '../builder/generated.ts';

const health: Resolvers = { Query: { health: () => 'ok' } };

export default health;

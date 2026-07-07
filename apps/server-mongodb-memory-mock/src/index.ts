import { type MongoMemoryServerConfig, startMockMongoDB } from '@cellix/server-mongodb-memory-mock-seedwork';
import { setupEnvironment } from './setup-environment.ts';

setupEnvironment();

const { PORT, DB_NAME, REPL_SET_NAME } = process.env;

/**
 * Starts an in-memory MongoDB replica set for local development. The blank
 * scaffold seeds nothing — add `collectionsToSeed` and a `seedDatabase`
 * function here once you have Mongoose models to seed.
 */
const config: MongoMemoryServerConfig = {
	port: Number(PORT ?? 50000),
	dbName: DB_NAME ?? 'simnova',
	replSetName: REPL_SET_NAME ?? 'globaldb',
};

startMockMongoDB(config).catch((err: unknown) => {
	console.error('Failed to start mock MongoDB:', err);
	process.exit(1);
});

import { type MongoMemoryServerConfig, startMockMongoDB } from '@cellix/server-mongodb-memory-mock-seedwork';
import { seedDatabase } from './seeds/index.ts';
import { setupEnvironment } from './setup-environment.ts';

setupEnvironment();

const { PORT, DB_NAME, REPL_SET_NAME } = process.env;

/**
 * Starts an in-memory MongoDB replica set for local development.
 */
const config: MongoMemoryServerConfig = {
	port: Number(PORT ?? 50000),
	dbName: DB_NAME ?? 'agentcourses',
	replSetName: REPL_SET_NAME ?? 'globaldb',
	collectionsToSeed: [],
	seedDatabase,
};

startMockMongoDB(config).catch((err: unknown) => {
	console.error('Failed to start mock MongoDB:', err);
	process.exit(1);
});

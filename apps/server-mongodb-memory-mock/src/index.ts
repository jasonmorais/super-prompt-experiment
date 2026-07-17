import { type MongoMemoryServerConfig, startMockMongoDB } from '@cellix/server-mongodb-memory-mock-seedwork';
import { setupEnvironment } from './setup-environment.ts';
import { seedDatabase } from './seed/seed.ts';

setupEnvironment();

const { PORT, DB_NAME, REPL_SET_NAME } = process.env;

const config: MongoMemoryServerConfig = {
	port: Number(PORT ?? 50000),
	dbName: DB_NAME ?? 'learnsphere',
	replSetName: REPL_SET_NAME ?? 'globaldb',
	collectionsToSeed: ['courses', 'learningrecords', 'teamoperations', 'teams', 'roles', 'users', 'assessments', 'assessmentattempts', 'organizations'],
	seedDatabase,
};

startMockMongoDB(config).catch((err: unknown) => {
	console.error('Failed to start mock MongoDB:', err);
	process.exit(1);
});

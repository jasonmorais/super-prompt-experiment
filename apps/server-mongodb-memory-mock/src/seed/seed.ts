import { fileURLToPath } from 'node:url';
import type { Connection } from 'mongoose';
import { seedLearnSphere } from './learnsphere.ts';

/**
 * Seeds the LearnSphere mock server in dependency order, matching the
 * CellixJS server's single orchestration entrypoint.
 */
export async function seedDatabase(connection: Connection): Promise<void> {
	if (!connection.db) throw new Error('MongoDB connection is not ready for LearnSphere seeding');
	const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
	await seedLearnSphere(connection.db, repoRoot);
	console.log('Seeded mock MongoDB memory server with initial data.');
}

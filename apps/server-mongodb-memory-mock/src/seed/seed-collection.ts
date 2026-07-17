import type { Db, Document } from 'mongodb';
import { upsertSeedDocuments } from './upsert-seed-documents.ts';

/** Seed one collection as desired state, using deterministic replacement/upsert semantics. */
export const seedCollection = async (db: Db, collectionName: string, documents: readonly Document[]): Promise<void> => {
	await upsertSeedDocuments(db, collectionName, documents);
	console.log(`  Seeded ${documents.length} ${collectionName}`);
};

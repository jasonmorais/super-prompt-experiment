import type { Db, Document } from 'mongodb';

/**
 * Seed data is a desired database state, not a stream of inserts. Replacing by
 * deterministic id makes startup safe to repeat and keeps local resets and
 * API-driven seeding consistent with the CellixJS mock-server pattern.
 */
export const upsertSeedDocuments = async (db: Db, collectionName: string, documents: readonly Document[]): Promise<void> => {
	if (documents.length === 0) return;
	await db.collection(collectionName).bulkWrite(
		documents.map((document) => ({
			replaceOne: {
				filter: { _id: document['_id'] },
				replacement: document,
				upsert: true,
			},
		})),
	);
};

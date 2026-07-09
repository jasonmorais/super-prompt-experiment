import type { Connection } from 'mongoose';

export const COURSE_COLLECTION_NAME = 'courses';

interface SeedCourse {
	title: string;
	summary: string;
	modality: 'online' | 'in-person' | 'hybrid';
	status: 'draft' | 'active' | 'retired';
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

const mockCourses: SeedCourse[] = [
	{
		title: 'AI Security Foundations',
		summary: 'Introductory course on secure AI-assisted development.',
		modality: 'online',
		status: 'active',
		tags: ['ai', 'security'],
		createdAt: '2026-01-15T00:00:00.000Z',
		updatedAt: '2026-06-01T00:00:00.000Z',
	},
	{
		title: 'Prompt Engineering for Analysts',
		summary: 'Practical techniques for creating reliable prompts and reviewing model output.',
		modality: 'hybrid',
		status: 'active',
		tags: ['ai', 'productivity'],
		createdAt: '2026-02-02T00:00:00.000Z',
		updatedAt: '2026-06-07T00:00:00.000Z',
	},
	{
		title: 'Secure Coding with TypeScript',
		summary: 'Hands-on secure development patterns for TypeScript services and applications.',
		modality: 'online',
		status: 'active',
		tags: ['typescript', 'security'],
		createdAt: '2026-02-20T00:00:00.000Z',
		updatedAt: '2026-05-29T00:00:00.000Z',
	},
	{
		title: 'Architecture Decision Records',
		summary: 'Learn how to write lightweight architecture records for evolving systems.',
		modality: 'in-person',
		status: 'active',
		tags: ['architecture', 'documentation'],
		createdAt: '2026-03-04T00:00:00.000Z',
		updatedAt: '2026-06-10T00:00:00.000Z',
	},
	{
		title: 'MongoDB Modeling Basics',
		summary: 'Model document data for local development and production MongoDB workloads.',
		modality: 'online',
		status: 'draft',
		tags: ['mongodb', 'data'],
		createdAt: '2026-03-18T00:00:00.000Z',
		updatedAt: '2026-05-12T00:00:00.000Z',
	},
	{
		title: 'Agentic Workflow Guardrails',
		summary: 'Use automated verification gates to keep coding-agent output reliable.',
		modality: 'hybrid',
		status: 'active',
		tags: ['agents', 'quality'],
		createdAt: '2026-04-01T00:00:00.000Z',
		updatedAt: '2026-06-15T00:00:00.000Z',
	},
	{
		title: 'BDD with Serenity',
		summary: 'Write acceptance tests and generate readable validation reports.',
		modality: 'online',
		status: 'active',
		tags: ['bdd', 'testing'],
		createdAt: '2026-04-10T00:00:00.000Z',
		updatedAt: '2026-06-17T00:00:00.000Z',
	},
	{
		title: 'Cloud Security Review',
		summary: 'Review common cloud application risks and practical mitigations.',
		modality: 'in-person',
		status: 'retired',
		tags: ['cloud', 'security'],
		createdAt: '2025-11-12T00:00:00.000Z',
		updatedAt: '2026-01-30T00:00:00.000Z',
	},
	{
		title: 'API Design Fundamentals',
		summary: 'Design consistent REST APIs with validation, errors, and documentation.',
		modality: 'hybrid',
		status: 'active',
		tags: ['api', 'documentation'],
		createdAt: '2026-04-22T00:00:00.000Z',
		updatedAt: '2026-06-20T00:00:00.000Z',
	},
	{
		title: 'Testing Data-Driven Services',
		summary: 'Build testable service boundaries around repositories and fixture data.',
		modality: 'online',
		status: 'draft',
		tags: ['testing', 'data'],
		createdAt: '2026-05-06T00:00:00.000Z',
		updatedAt: '2026-06-02T00:00:00.000Z',
	},
	{
		title: 'Responsible AI Operations',
		summary: 'Operational practices for reviewing and governing AI-assisted workflows.',
		modality: 'in-person',
		status: 'active',
		tags: ['ai', 'operations'],
		createdAt: '2026-05-18T00:00:00.000Z',
		updatedAt: '2026-06-21T00:00:00.000Z',
	},
	{
		title: 'Legacy Modernization Planning',
		summary: 'Plan modernization increments with architecture, test coverage, and risk controls.',
		modality: 'hybrid',
		status: 'retired',
		tags: ['architecture', 'planning'],
		createdAt: '2025-12-03T00:00:00.000Z',
		updatedAt: '2026-02-14T00:00:00.000Z',
	},
];

/**
 * Seeds the `courses` collection. Documents match the Mongoose `Course` model
 * (see `@axc/data-sources-mongoose-models`): a generated `_id` ObjectId,
 * `Date` timestamps, `schemaVersion`, and a `version` key.
 */
export const seedCourses = async (connection: Connection) => {
	const collection = connection.collection(COURSE_COLLECTION_NAME);

	await collection.createIndex({ title: 1 });
	await collection.deleteMany({});
	await collection.insertMany(
		mockCourses.map((course) => ({
			title: course.title,
			summary: course.summary,
			modality: course.modality,
			status: course.status,
			tags: course.tags,
			schemaVersion: '1.0.0',
			createdAt: new Date(course.createdAt),
			updatedAt: new Date(course.updatedAt),
			version: 0,
		})),
	);
};

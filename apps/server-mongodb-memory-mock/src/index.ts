import { type MongoMemoryServerConfig, startMockMongoDB } from '@cellix/server-mongodb-memory-mock-seedwork';
import { setupEnvironment } from './setup-environment.ts';
import { ObjectId } from 'mongodb';

setupEnvironment();

const { PORT, DB_NAME, REPL_SET_NAME } = process.env;

/**
 * Starts a deterministic LearnSphere development tenant once the API has
 * registered its Mongoose collections.
 */
const config: MongoMemoryServerConfig = {
	port: Number(PORT ?? 50000),
	dbName: DB_NAME ?? 'learnsphere',
	replSetName: REPL_SET_NAME ?? 'globaldb',
	collectionsToSeed: ['courses', 'learningrecords'],
	seedDatabase: async (connection) => {
		const db = connection.db;
		if (!db) throw new Error('MongoDB connection is not ready for LearnSphere seeding');
		const learnerId = '00000000-0000-4000-8000-000000000001';
		const organizationId = 'northstar-digital';
		const now = new Date();
		const courseDocuments = [
			{
				_id: new ObjectId('66a000000000000000000001'), organizationId, title: 'Designing Accessible Digital Products', summary: 'Build inclusive product experiences that work for everyone.', description: 'A practical pathway through accessibility research, interaction design, content, testing, and delivery.', status: 'PUBLISHED', level: 'INTERMEDIATE', category: 'Design', tags: ['accessibility', 'inclusive-design'], skills: ['WCAG', 'Inclusive research'], createdBy: 'instructor@northstar.example', publishedAt: now, schemaVersion: '1.0.0', createdAt: now, updatedAt: now,
				modules: [{ key: 'foundations', title: 'Accessibility foundations', description: 'Understand barriers and inclusive design principles.', order: 1, lessons: [{ key: 'accessibility-foundations', title: 'Accessibility is a product quality', type: 'ARTICLE', estimatedMinutes: 20, required: true }, { key: 'forms-validation', title: 'Inclusive forms and validation', type: 'PROJECT', estimatedMinutes: 35, required: true }, { key: 'foundations-quiz', title: 'Foundations knowledge check', type: 'QUIZ', estimatedMinutes: 15, required: true }] }],
			},
			{
				_id: new ObjectId('66a000000000000000000002'), organizationId, title: 'Practical Product Discovery', summary: 'Turn uncertain product opportunities into evidence-backed decisions.', description: 'Plan interviews, synthesize evidence, frame opportunities, and test assumptions with lightweight experiments.', status: 'PUBLISHED', level: 'INTERMEDIATE', category: 'Product', tags: ['discovery', 'research'], skills: ['Interviewing', 'Opportunity mapping'], createdBy: 'instructor@northstar.example', publishedAt: now, schemaVersion: '1.0.0', createdAt: now, updatedAt: now,
				modules: [{ key: 'discovery-cycle', title: 'The discovery cycle', description: 'Move from assumptions to evidence.', order: 1, lessons: [{ key: 'frame-opportunity', title: 'Frame the opportunity', type: 'VIDEO', estimatedMinutes: 25, required: true }, { key: 'interview-plan', title: 'Create an interview plan', type: 'PROJECT', estimatedMinutes: 45, required: true }, { key: 'synthesis', title: 'Synthesize research evidence', type: 'ARTICLE', estimatedMinutes: 30, required: true }] }],
			},
			{
				_id: new ObjectId('66a000000000000000000003'), organizationId, title: 'Data-Informed Decision Making', summary: 'Use meaningful evidence without losing judgment and context.', description: 'A foundation in metrics, experiments, interpretation, and communicating uncertainty.', status: 'PUBLISHED', level: 'FOUNDATIONAL', category: 'Analytics', tags: ['data-literacy'], skills: ['Metrics', 'Experimentation'], createdBy: 'instructor@northstar.example', publishedAt: now, schemaVersion: '1.0.0', createdAt: now, updatedAt: now,
				modules: [{ key: 'metrics', title: 'Metrics that matter', description: 'Choose and interpret useful measures.', order: 1, lessons: [{ key: 'metric-selection', title: 'Choose outcome metrics', type: 'ARTICLE', estimatedMinutes: 25, required: true }, { key: 'interpretation', title: 'Interpret results in context', type: 'QUIZ', estimatedMinutes: 20, required: true }] }],
			},
			{
				_id: new ObjectId('66a000000000000000000004'), organizationId, title: 'Facilitating Effective Workshops', summary: 'Design and facilitate focused sessions that produce clear decisions.', description: 'Prepare inclusive workshops, guide productive discussion, handle difficult dynamics, and turn session outputs into accountable next steps.', status: 'PUBLISHED', level: 'INTERMEDIATE', category: 'Collaboration', tags: ['facilitation', 'workshops'], skills: ['Facilitation', 'Decision making'], createdBy: 'instructor@northstar.example', publishedAt: now, schemaVersion: '1.0.0', createdAt: now, updatedAt: now,
				modules: [{ key: 'workshop-design', title: 'Workshop design and delivery', description: 'Move from a desired outcome to a well-run collaborative session.', order: 1, lessons: [{ key: 'outcome-design', title: 'Define the decision and outcome', type: 'ARTICLE', estimatedMinutes: 20, required: true }, { key: 'facilitation-plan', title: 'Build a facilitation plan', type: 'PROJECT', estimatedMinutes: 40, required: true }, { key: 'difficult-dynamics', title: 'Navigate difficult group dynamics', type: 'VIDEO', estimatedMinutes: 25, required: true }] }],
			},
		];
		await db.collection('courses').insertMany(courseDocuments);
		const [accessibilityCourse, discoveryCourse, analyticsCourse] = courseDocuments;
		if (!accessibilityCourse || !discoveryCourse || !analyticsCourse) throw new Error('LearnSphere development courses were not constructed');
		await db.collection('learningrecords').insertMany([
			{ _id: new ObjectId('66b000000000000000000001'), organizationId, learnerId, courseId: accessibilityCourse._id.toString(), courseTitle: accessibilityCourse.title, courseCategory: accessibilityCourse.category, requiredActivityKeys: ['accessibility-foundations', 'forms-validation', 'foundations-quiz'], source: 'MANAGER_ASSIGNED', status: 'IN_PROGRESS', assignedBy: 'manager@northstar.example', assignedAt: new Date('2026-06-20'), dueAt: new Date('2026-08-01'), startedAt: new Date('2026-06-22'), completedAt: null, waivedAt: null, waiverReason: null, activityProgress: [{ activityKey: 'accessibility-foundations', completedAt: new Date('2026-07-10'), timeSpentMinutes: 22, assessmentScore: null, attempts: 1 }, { activityKey: 'forms-validation', completedAt: new Date('2026-07-12'), timeSpentMinutes: 40, assessmentScore: 88, attempts: 1 }], schemaVersion: '1.0.0', createdAt: now, updatedAt: now },
			{ _id: new ObjectId('66b000000000000000000002'), organizationId, learnerId, courseId: discoveryCourse._id.toString(), courseTitle: discoveryCourse.title, courseCategory: discoveryCourse.category, requiredActivityKeys: ['frame-opportunity', 'interview-plan', 'synthesis'], source: 'SELF_ENROLLED', status: 'IN_PROGRESS', assignedBy: null, assignedAt: new Date('2026-07-01'), dueAt: null, startedAt: new Date('2026-07-02'), completedAt: null, waivedAt: null, waiverReason: null, activityProgress: [{ activityKey: 'frame-opportunity', completedAt: new Date('2026-07-05'), timeSpentMinutes: 27, assessmentScore: null, attempts: 1 }], schemaVersion: '1.0.0', createdAt: now, updatedAt: now },
			{ _id: new ObjectId('66b000000000000000000003'), organizationId, learnerId, courseId: analyticsCourse._id.toString(), courseTitle: analyticsCourse.title, courseCategory: analyticsCourse.category, requiredActivityKeys: ['metric-selection', 'interpretation'], source: 'PROGRAM_ASSIGNED', status: 'NOT_STARTED', assignedBy: 'people-team@northstar.example', assignedAt: new Date('2026-07-08'), dueAt: new Date('2026-09-15'), startedAt: null, completedAt: null, waivedAt: null, waiverReason: null, activityProgress: [], schemaVersion: '1.0.0', createdAt: now, updatedAt: now },
		]);
	},
};

startMockMongoDB(config).catch((err: unknown) => {
	console.error('Failed to start mock MongoDB:', err);
	process.exit(1);
});

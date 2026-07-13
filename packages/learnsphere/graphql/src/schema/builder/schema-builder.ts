import { buildCellixSchema } from '@cellix/graphql-codegen';
import type { GraphQLSchema } from 'graphql';
import type { GraphContext } from '../context.ts';
import { resolvers } from './resolver-builder.ts';

const applicationTypeDefs = /* GraphQL */ `
	extend type Query {
		health: String!
		courseById(id: ObjectID!): Course
		courses(organizationId: String!, status: CourseStatus, search: String, limit: Int): [Course!]!
		myLearning(organizationId: String!): [LearningRecord!]!
	}

	extend type Mutation {
		courseCreate(input: CourseCreateInput!): CourseMutationResult!
		courseAddModule(input: CourseAddModuleInput!): CourseMutationResult!
		courseSubmitForReview(id: ObjectID!): CourseMutationResult!
		coursePublish(id: ObjectID!): CourseMutationResult!
		selfEnroll(input: SelfEnrollInput!): LearningRecordMutationResult!
		assignLearning(input: AssignLearningInput!): LearningRecordMutationResult!
		recordActivity(input: RecordActivityInput!): LearningRecordMutationResult!
		waiveLearning(input: WaiveLearningInput!): LearningRecordMutationResult!
	}

	enum CourseStatus { DRAFT IN_REVIEW PUBLISHED ARCHIVED }
	enum CourseLevel { FOUNDATIONAL INTERMEDIATE ADVANCED }
	enum LessonType { ARTICLE VIDEO QUIZ PROJECT RESOURCE }
	enum EnrollmentSource { SELF_ENROLLED MANAGER_ASSIGNED PROGRAM_ASSIGNED COMPLIANCE_ASSIGNED }
	enum LearningRecordStatus { NOT_STARTED IN_PROGRESS COMPLETED OVERDUE WAIVED }

	type Course implements MongoBase {
		id: ObjectID!
		schemaVersion: String!
		createdAt: DateTime!
		updatedAt: DateTime!
		organizationId: String!
		title: String!
		summary: String!
		description: String!
		status: CourseStatus!
		level: CourseLevel!
		category: String!
		tags: [String!]!
		skills: [String!]!
		modules: [CourseModule!]!
		lessonCount: Int!
		estimatedMinutes: Int!
		createdBy: String!
		publishedAt: DateTime
	}

	type CourseModule { key: String! title: String! description: String! order: Int! lessons: [Lesson!]! }
	type Lesson { key: String! title: String! type: LessonType! estimatedMinutes: Int! required: Boolean! }
	type ActivityProgress { activityKey: String! completedAt: DateTime! timeSpentMinutes: Int! assessmentScore: Float attempts: Int! }
	type LearningRecord implements MongoBase {
		id: ObjectID! schemaVersion: String! createdAt: DateTime! updatedAt: DateTime!
		organizationId: String! learnerId: String! courseId: String! courseTitle: String! courseCategory: String!
		source: EnrollmentSource! status: LearningRecordStatus! assignedBy: String assignedAt: DateTime! dueAt: DateTime
		startedAt: DateTime completedAt: DateTime activityProgress: [ActivityProgress!]!
		progressPercent: Int! completedActivityCount: Int! isOverdue: Boolean!
	}

	input CourseCreateInput {
		organizationId: String!
		title: String!
		summary: String!
		description: String!
		level: CourseLevel!
		category: String!
		tags: [String!]
		skills: [String!]
	}
	input CourseAddModuleInput { courseId: ObjectID! module: CourseModuleInput! }
	input CourseModuleInput { key: String! title: String! description: String! lessons: [LessonInput!]! }
	input LessonInput { key: String! title: String! type: LessonType! estimatedMinutes: Int! required: Boolean! }
	input SelfEnrollInput { organizationId: String! courseId: ObjectID! }
	input AssignLearningInput { organizationId: String! learnerId: String! courseId: ObjectID! dueAt: DateTime source: EnrollmentSource! }
	input RecordActivityInput { id: ObjectID! activityKey: String! timeSpentMinutes: Int! assessmentScore: Float }
	input WaiveLearningInput { id: ObjectID! reason: String! }

	type CourseMutationResult { status: MutationStatus! course: Course }
	type LearningRecordMutationResult { status: MutationStatus! learningRecord: LearningRecord }
`;

export const combinedSchema: GraphQLSchema = buildCellixSchema<GraphContext>([applicationTypeDefs], [resolvers]);

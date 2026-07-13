import type { CourseCreateCommand, CourseModuleCommand } from '@learnsphere/application-services';
import type { IResolvers } from '@graphql-tools/utils';
import type { IMiddleware } from 'graphql-middleware';
import type { GraphContext } from '../context.ts';

const mutation = async (work: Promise<unknown>) => {
	try { return { status: { success: true }, course: await work }; }
	catch (error) { return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Unknown error' } }; }
};

const learningRecordMutation = async (work: Promise<unknown>) => {
	try { return { status: { success: true }, learningRecord: await work }; }
	catch (error) { return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Unknown error' } }; }
};

const requireUser = (context: GraphContext): void => {
	if (!context.applicationServices.verifiedUser?.verifiedJwt?.sub) throw new Error('Unauthorized');
};

export const resolvers: IResolvers<unknown, GraphContext> = {
	Query: {
		health: () => 'ok',
		courseById: (_parent, args: { id: string }, context) => context.applicationServices.Learning.Course.queryById(args),
		courses: (_parent, args: { organizationId: string; status?: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED'; search?: string; limit?: number }, context) =>
			context.applicationServices.Learning.Course.list(args),
		myLearning: (_parent, args: { organizationId: string }, context) => { requireUser(context); return context.applicationServices.Delivery.LearningRecord.myLearning(args); },
	},
	Mutation: {
		courseCreate: (_parent, args: { input: CourseCreateCommand }, context) => { requireUser(context); return mutation(context.applicationServices.Learning.Course.create(args.input)); },
		courseAddModule: (_parent, args: { input: CourseModuleCommand }, context) => { requireUser(context); return mutation(context.applicationServices.Learning.Course.addModule(args.input)); },
		courseSubmitForReview: (_parent, args: { id: string }, context) => { requireUser(context); return mutation(context.applicationServices.Learning.Course.submitForReview(args)); },
		coursePublish: (_parent, args: { id: string }, context) => { requireUser(context); return mutation(context.applicationServices.Learning.Course.publish(args)); },
		selfEnroll: (_parent, args: { input: { organizationId: string; courseId: string } }, context) => { requireUser(context); return learningRecordMutation(context.applicationServices.Delivery.LearningRecord.selfEnroll(args.input)); },
		assignLearning: (_parent, args: { input: { organizationId: string; learnerId: string; courseId: string; dueAt?: Date; source: 'MANAGER_ASSIGNED' | 'PROGRAM_ASSIGNED' | 'COMPLIANCE_ASSIGNED' } }, context) => { requireUser(context); return learningRecordMutation(context.applicationServices.Delivery.LearningRecord.assign(args.input)); },
		recordActivity: (_parent, args: { input: { id: string; activityKey: string; timeSpentMinutes: number; assessmentScore?: number } }, context) => { requireUser(context); return learningRecordMutation(context.applicationServices.Delivery.LearningRecord.recordActivity(args.input)); },
		waiveLearning: (_parent, args: { input: { id: string; reason: string } }, context) => { requireUser(context); return learningRecordMutation(context.applicationServices.Delivery.LearningRecord.waive(args.input)); },
	},
};

export const permissions: IMiddleware = {};

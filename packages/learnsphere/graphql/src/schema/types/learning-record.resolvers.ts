import type { Domain } from '@learnsphere/domain';
import type { Resolvers } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';

const requireUser = (context: GraphContext): string => {
	const subject = context.applicationServices.verifiedUser?.verifiedJwt?.sub;
	if (!subject) throw new Error('Unauthorized');
	return subject;
};

const mutation = async <T>(work: Promise<T>) => {
	try {
		return { status: { success: true }, learningRecord: await work };
	} catch (error) {
		return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'The request could not be completed' } };
	}
};

const learningRecord: Resolvers = {
	Query: {
		myLearning: (_parent, args, context) => {
			requireUser(context);
			return context.applicationServices.Delivery.LearningRecord.myLearning(args);
		},
		teamLearning: (_parent, args, context) => {
			requireUser(context);
			return context.applicationServices.Delivery.LearningRecord.teamLearning({ organizationId: args.organizationId, ...(args.teamName ? { teamName: args.teamName } : {}) });
		},
		trainingLeaderboard: (_parent, args, context) => {
			requireUser(context);
			return context.applicationServices.Delivery.LearningRecord.trainingLeaderboard({ organizationId: args.organizationId, ...(args.limit ? { limit: args.limit } : {}) });
		},
	},
	Mutation: {
		selfEnroll: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Delivery.LearningRecord.selfEnroll(args.input));
		},
		assignLearning: (_parent, args, context) => {
			requireUser(context);
			return mutation(
				context.applicationServices.Delivery.LearningRecord.assign({
					organizationId: args.input.organizationId,
					learnerId: args.input.learnerId,
					learnerDisplayName: args.input.learnerDisplayName,
					learnerEmail: args.input.learnerEmail,
					teamName: args.input.teamName,
					courseId: args.input.courseId,
					source: args.input.source as Exclude<Domain.Contexts.Delivery.LearningRecord.EnrollmentSource, 'SELF_ENROLLED'>,
					...(args.input.dueAt ? { dueAt: args.input.dueAt } : {}),
				}),
			);
		},
		recordActivity: (_parent, args, context) => {
			requireUser(context);
			return mutation(
				context.applicationServices.Delivery.LearningRecord.recordActivity({
					id: args.input.id,
					activityKey: args.input.activityKey,
					timeSpentMinutes: args.input.timeSpentMinutes,
					...(args.input.completionScreenshot ? { completionScreenshot: args.input.completionScreenshot } : {}),
				}),
			);
		},
		waiveLearning: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Delivery.LearningRecord.waive(args.input));
		},
		unassignLearning: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Delivery.LearningRecord.unassign({ id: args.id }));
		},
	},
};

export default learningRecord;

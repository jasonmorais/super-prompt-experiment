import type { Domain } from '@learnsphere/domain';
import type { CourseCreateCommand } from '@learnsphere/application-services';
import type { Resolvers } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';

const requireUser = (context: GraphContext): string => {
	const subject = context.applicationServices.verifiedUser?.verifiedJwt?.sub;
	if (!subject) throw new Error('Unauthorized');
	return subject;
};

const mutation = async <T>(work: Promise<T>, field: 'course') => {
	try {
		return { status: { success: true }, [field]: await work };
	} catch (error) {
		return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'The request could not be completed' } };
	}
};

const course: Resolvers = {
	Query: {
		courseById: (_parent, args, context) => {
			const user = requireUser(context);
			const roles = context.applicationServices.verifiedUser?.verifiedJwt?.roles ?? [];
			return context.applicationServices.Learning.Course.queryById({ id: args.id, ...(context.applicationServices.verifiedUser?.verifiedJwt?.tid ? { organizationId: context.applicationServices.verifiedUser.verifiedJwt.tid } : {}), ...(roles.some((role) => ['LearningAdmin', 'Manager', 'Instructor'].includes(role)) ? {} : { learnerId: user }) });
		},
		courses: (_parent, args, context) => {
			const user = requireUser(context);
			const roles = context.applicationServices.verifiedUser?.verifiedJwt?.roles ?? [];
			return context.applicationServices.Learning.Course.list({
				organizationId: args.organizationId,
				...(roles.some((role) => ['LearningAdmin', 'Manager', 'Instructor'].includes(role)) ? {} : { learnerId: user }),
				...(args.status ? { status: args.status as Domain.Contexts.Learning.Course.CourseStatus } : {}),
				...(args.search ? { search: args.search } : {}),
				...(args.limit !== null && args.limit !== undefined ? { limit: args.limit } : {}),
			});
		},
	},
	Mutation: {
		courseCreate: (_parent, args, context) => {
			requireUser(context);
			const input: CourseCreateCommand = {
				organizationId: args.input.organizationId,
				title: args.input.title,
				summary: args.input.summary,
				description: args.input.description,
				level: args.input.level as Domain.Contexts.Learning.Course.CourseLevel,
				category: args.input.category,
				...(args.input.tags ? { tags: [...args.input.tags] } : {}),
				...(args.input.skills ? { skills: [...args.input.skills] } : {}),
				discoverability: (args.input.discoverability ?? 'CATALOG') as Domain.Contexts.Learning.Course.CourseDiscoverability,
				requiresCompletionScreenshot: args.input.requiresCompletionScreenshot ?? false,
			};
			return mutation(context.applicationServices.Learning.Course.create(input), 'course');
		},
		courseAddModule: (_parent, args, context) => {
			requireUser(context);
			return mutation(
				context.applicationServices.Learning.Course.addModule({ courseId: args.input.courseId, module: { ...args.input.module, lessons: args.input.module.lessons as Domain.Contexts.Learning.Course.Lesson[] } }),
				'course',
			);
		},
		courseSubmitForReview: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Learning.Course.submitForReview({ id: args.id }), 'course');
		},
		coursePublish: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Learning.Course.publish({ id: args.id }), 'course');
		},
		courseUpdate: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Learning.Course.update({ id: args.input.id, title: args.input.title, summary: args.input.summary, description: args.input.description, level: args.input.level as Domain.Contexts.Learning.Course.CourseLevel, category: args.input.category, tags: [...(args.input.tags ?? [])], skills: [...(args.input.skills ?? [])], discoverability: args.input.discoverability as Domain.Contexts.Learning.Course.CourseDiscoverability, requiresCompletionScreenshot: args.input.requiresCompletionScreenshot }), 'course');
		},
		courseDelete: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Learning.Course.delete({ id: args.id }), 'course');
		},
	},
};

export default course;

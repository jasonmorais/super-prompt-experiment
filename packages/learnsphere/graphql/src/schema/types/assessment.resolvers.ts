import type { Domain } from '@learnsphere/domain';
import type { Resolvers } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';
const requireUser = (context: GraphContext) => { const user = context.applicationServices.verifiedUser; if (!user?.verifiedJwt) throw new Error('Unauthorized'); return user; };
const assessment: Resolvers = {
	Query: {
		assessments: (_parent, args, context) => { requireUser(context); return context.applicationServices.Learning.Assessment.list(args.organizationId); },
		assessmentById: (_parent, args, context) => { requireUser(context); return context.applicationServices.Learning.Assessment.queryById(String(args.id)); },
		assessmentForAuthoring: (_parent, args, context) => { const user = requireUser(context); if (!user.staffUser) throw new Error('Only staff users can author assessments'); return context.applicationServices.Learning.Assessment.queryForAuthoring(String(args.id)); },
		myAssessmentAttempts: (_parent, _args, context) => { requireUser(context); return context.applicationServices.Delivery.AssessmentAttempt.myAttempts(); },
	},
	Mutation: {
		assessmentCreate: async (_parent, args, context) => { try { requireUser(context); const assessment = await context.applicationServices.Learning.Assessment.create({ ...args.input, questions: args.input.questions.map((question) => ({ ...question, type: question.type as Domain.Contexts.Learning.Assessment.AssessmentQuestionType, options: question.options.map((option) => ({ ...option })) })) }); return { status: { success: true }, assessment }; } catch (error) { return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Assessment could not be created' }, assessment: null }; } },
		assessmentUpdate: async (_parent, args, context) => { try { requireUser(context); const assessment = await context.applicationServices.Learning.Assessment.update({ ...args.input, id: String(args.input.id), questions: args.input.questions.map((question) => ({ ...question, type: question.type as Domain.Contexts.Learning.Assessment.AssessmentQuestionType, options: question.options.map((option) => ({ ...option })) })) }); return { status: { success: true }, assessment }; } catch (error) { return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Assessment could not be updated' }, assessment: null }; } },
		assessmentPublish: async (_parent, args, context) => { try { requireUser(context); const assessment = await context.applicationServices.Learning.Assessment.publish(String(args.id)); return { status: { success: true }, assessment }; } catch (error) { return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Assessment could not be published' }, assessment: null }; } },
		assessmentSubmit: async (_parent, args, context) => { try { const user = requireUser(context); if (user.openIdConfigKey === 'StaffPortal') throw new Error('Only learners can submit assessments'); const attempt = await context.applicationServices.Delivery.AssessmentAttempt.submit({ assessmentId: String(args.input.assessmentId), learningRecordId: String(args.input.learningRecordId), courseId: String(args.input.courseId), activityKey: args.input.activityKey, timeSpentMinutes: args.input.timeSpentMinutes, responses: args.input.responses.map((response) => ({ questionKey: response.questionKey, selectedOptionKeys: [...response.selectedOptionKeys] })) }); return { status: { success: true }, attempt }; } catch (error) { return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'Assessment could not be submitted' }, attempt: null }; } },
	},
};
export default assessment;

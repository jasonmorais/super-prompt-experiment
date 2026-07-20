import type { Domain } from '@learnsphere/domain';
import type { Resolvers } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';
import { attachTeamOperation } from './team-operation-attachment.ts';

const requireUser = (context: GraphContext): string => {
	const subject = context.applicationServices.verifiedUser?.verifiedJwt?.sub;
	if (!subject) throw new Error('Unauthorized');
	return subject;
};

const mutation = async <T>(work: Promise<T>) => {
	try {
		return { status: { success: true }, teamOperation: await work };
	} catch (error) {
		return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'The request could not be completed' } };
	}
};

const teamOperation: Resolvers = {
	Query: {
		myTeamOperations: (_parent, args, context) => {
			requireUser(context);
			return context.applicationServices.Operations.TeamOperation.myOperations(args);
		},
		teamOperations: (_parent, args, context) => {
			requireUser(context);
			return context.applicationServices.Operations.TeamOperation.teamOperations({ organizationId: args.organizationId, ...(args.teamName ? { teamName: args.teamName } : {}) });
		},
	},
	Mutation: {
		teamOperationCreate: (_parent, args, context) => {
			requireUser(context);
			return mutation(
				context.applicationServices.Operations.TeamOperation.create({
					organizationId: args.input.organizationId,
					title: args.input.title,
					description: args.input.description,
					category: args.input.category,
					priority: args.input.priority as Domain.Contexts.Operations.TeamOperation.TeamOperationPriority,
					assigneeId: args.input.assigneeId,
					assigneeDisplayName: args.input.assigneeDisplayName,
					assigneeEmail: args.input.assigneeEmail,
					teamName: args.input.teamName,
					...(args.input.dueAt ? { dueAt: args.input.dueAt } : {}),
				}),
			);
		},
		teamOperationSubmit: (_parent, args, context) => {
			requireUser(context);
			return mutation(
				context.applicationServices.Operations.TeamOperation.submit({
					id: args.input.id,
					completionNote: args.input.completionNote,
					...(args.input.completionEvidence ? { completionEvidence: args.input.completionEvidence } : {}),
				}),
			);
		},
		teamOperationConfirm: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Operations.TeamOperation.confirm({ id: args.input.id, ...(args.input.note ? { note: args.input.note } : {}) }));
		},
		teamOperationCancel: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Operations.TeamOperation.cancel({ id: args.input.id, reason: args.input.reason }));
		},
		teamOperationDelete: async (_parent, args, context) => {
			requireUser(context);
			try {
				const operation = await context.applicationServices.Operations.TeamOperation.delete({ id: args.id });
				await Promise.all(operation.attachments.map((attachment) => context.blobStorageService.deleteBlob({ containerName: 'team-attachments', blobName: attachment.blobName }).catch(() => undefined)));
				return { status: { success: true }, teamOperation: operation };
			} catch (error) {
				return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'The request could not be completed' } };
			}
		},
		teamOperationUpdate: (_parent, args, context) => {
			requireUser(context);
			return mutation(
				context.applicationServices.Operations.TeamOperation.update({
					id: args.input.id,
					title: args.input.title,
					description: args.input.description,
					category: args.input.category,
					priority: args.input.priority as Domain.Contexts.Operations.TeamOperation.TeamOperationPriority,
					assigneeId: args.input.assigneeId,
					assigneeDisplayName: args.input.assigneeDisplayName,
					assigneeEmail: args.input.assigneeEmail,
					teamName: args.input.teamName,
					...(args.input.dueAt ? { dueAt: args.input.dueAt } : {}),
				}),
			);
		},
		teamOperationComment: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Operations.TeamOperation.comment({ id: args.input.id, body: args.input.body }));
		},
		teamOperationAttach: (_parent, args, context) => {
			requireUser(context);
			return attachTeamOperation(args.input, context);
		},
	},
};

export default teamOperation;

import crypto from 'node:crypto';
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
			return mutation(context.applicationServices.Operations.TeamOperation.create({ organizationId: args.input.organizationId, title: args.input.title, description: args.input.description, category: args.input.category, priority: args.input.priority as Domain.Contexts.Operations.TeamOperation.TeamOperationPriority, assigneeId: args.input.assigneeId, assigneeDisplayName: args.input.assigneeDisplayName, assigneeEmail: args.input.assigneeEmail, teamName: args.input.teamName, ...(args.input.dueAt ? { dueAt: args.input.dueAt } : {}) }));
		},
		teamOperationSubmit: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Operations.TeamOperation.submit({ id: args.input.id, completionNote: args.input.completionNote, ...(args.input.completionEvidence ? { completionEvidence: args.input.completionEvidence } : {}) }));
		},
		teamOperationConfirm: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Operations.TeamOperation.confirm({ id: args.input.id, ...(args.input.note ? { note: args.input.note } : {}) }));
		},
		teamOperationCancel: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Operations.TeamOperation.cancel({ id: args.input.id, reason: args.input.reason }));
		},
		teamOperationUpdate: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Operations.TeamOperation.update({ id: args.input.id, title: args.input.title, description: args.input.description, category: args.input.category, priority: args.input.priority as Domain.Contexts.Operations.TeamOperation.TeamOperationPriority, ...(args.input.dueAt ? { dueAt: args.input.dueAt } : {}) }));
		},
		teamOperationComment: (_parent, args, context) => {
			requireUser(context);
			return mutation(context.applicationServices.Operations.TeamOperation.comment({ id: args.input.id, body: args.input.body }));
		},
		teamOperationAttach: async (_parent, args, context) => {
			requireUser(context);
			const rawName = args.input.fileName.trim().replaceAll(/[^a-zA-Z0-9._-]/g, '_');
			if (!rawName || rawName.length > 255) return { status: { success: false, errorMessage: 'A valid file name is required' } };
			const content = Buffer.from(args.input.contentBase64, 'base64');
			if (!content.length || content.length > 8_000_000) return { status: { success: false, errorMessage: 'Attachments must be smaller than 8 MB' } };
			const blobName = `team-operations/${args.input.id}/${crypto.randomUUID()}-${rawName}`;
			try {
				await context.blobStorageService.uploadData({ containerName: 'team-attachments', blobName, data: content, httpHeaders: { blobContentType: args.input.contentType || 'application/octet-stream' } });
				const result = await mutation(context.applicationServices.Operations.TeamOperation.attach({ id: args.input.id, attachment: { id: crypto.randomUUID(), fileName: rawName, contentType: args.input.contentType || 'application/octet-stream', size: content.length, blobName, uploadedBy: context.applicationServices.verifiedUser?.verifiedJwt?.email ?? context.applicationServices.verifiedUser?.verifiedJwt?.sub ?? 'unknown', uploadedAt: new Date() } }));
				if (!result.status.success) await context.blobStorageService.deleteBlob({ containerName: 'team-attachments', blobName });
				return result;
			} catch (error) {
				return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'The attachment could not be saved' } };
			}
		},
	},
};

export default teamOperation;

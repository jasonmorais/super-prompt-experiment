import crypto from 'node:crypto';
import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { cancel } from './cancel.ts';
import { confirm } from './confirm.ts';
import { create, type TeamOperationCreateCommand } from './create.ts';
import { deleteOperation } from './delete.ts';
import { myOperations } from './my-operations.ts';
import { submit } from './submit.ts';
import { teamOperations } from './team-operations.ts';
import { mutateDiscussion } from './mutate.ts';
import { mutate } from './mutate.ts';

export type { TeamOperationCreateCommand };

export interface TeamOperationApplicationService {
	myOperations: (command: { organizationId: string }) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference[]>;
	teamOperations: (command: { organizationId: string; teamName?: string }) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference[]>;
	create: (command: Omit<TeamOperationCreateCommand, 'createdBy'>) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference>;
	submit: (command: { id: string; completionNote: string; completionEvidence?: string }) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference>;
	confirm: (command: { id: string; note?: string }) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference>;
	cancel: (command: { id: string; reason: string }) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference>;
	delete: (command: { id: string }) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference>;
	comment: (command: { id: string; body: string }) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference>;
	attach: (command: { id: string; attachment: Domain.Contexts.Operations.TeamOperation.TeamOperationAttachment }) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference>;
	removeAttachment: (command: {
		id: string;
		attachmentId: string;
	}) => Promise<{ operation: Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference; removedAttachment: Domain.Contexts.Operations.TeamOperation.TeamOperationAttachment }>;
	update: (command: {
		id: string;
		title: string;
		description: string;
		category: string;
		priority: Domain.Contexts.Operations.TeamOperation.TeamOperationPriority;
		assigneeId: string;
		assigneeDisplayName: string;
		assigneeEmail: string;
		teamName: string;
		dueAt?: Date;
	}) => Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference>;
}

export const TeamOperation = (dataSources: DataSources, identity: { sub: string; email?: string; given_name?: string; family_name?: string }): TeamOperationApplicationService => {
	const actorId = identity.email ?? identity.sub;
	const actorName = `${identity.given_name ?? ''} ${identity.family_name ?? ''}`.trim() || actorId;
	return {
		myOperations: (command) => myOperations(dataSources)({ ...command, assigneeId: identity.sub }),
		teamOperations: teamOperations(dataSources),
		create: (command) => create(dataSources)({ ...command, createdBy: actorId }),
		submit: (command) => submit(dataSources)({ ...command, actorId }),
		confirm: (command) => confirm(dataSources)({ ...command, actorId }),
		cancel: (command) => cancel(dataSources)({ ...command, actorId }),
		delete: (command) => deleteOperation(dataSources)(command),
		comment: (command) => mutateDiscussion(dataSources, command.id, (operation) => operation.addComment({ id: crypto.randomUUID(), body: command.body, authorId: actorId, authorName: actorName, createdAt: new Date() })),
		attach: (command) => mutateDiscussion(dataSources, command.id, (operation) => operation.addAttachment(command.attachment)),
		removeAttachment: async (command) => {
			let removedAttachment: Domain.Contexts.Operations.TeamOperation.TeamOperationAttachment | undefined;
			const operation = await mutateDiscussion(dataSources, command.id, (entity) => {
				removedAttachment = entity.removeAttachment(command.attachmentId, actorId);
			});
			if (!removedAttachment) throw new Error('Attachment not found');
			return { operation, removedAttachment };
		},
		update: async (command) => {
			const operation = await dataSources.readonlyDataSource.Operations.TeamOperation.TeamOperationReadRepo.getById(command.id);
			if (!operation) throw new Error('Team operation was not found');
			return mutate(dataSources, command.id, (entity) => entity.updateDetails({ ...command, dueAt: command.dueAt ?? null, changedBy: actorId }));
		},
	};
};

import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { mutate } from './mutate.ts';

export interface TeamOperationSubmitCommand {
	id: string;
	actorId: string;
	completionNote: string;
	completionEvidence?: string;
}

export const submit =
	(dataSources: DataSources) =>
	(command: TeamOperationSubmitCommand): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference> =>
		mutate(dataSources, command.id, (operation) => operation.submitForConfirmation(command.actorId, command.completionNote, command.completionEvidence));

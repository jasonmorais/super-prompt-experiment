import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const myOperations =
	(dataSources: DataSources) =>
	(command: { organizationId: string; assigneeId: string }): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference[]> => {
		return dataSources.readonlyDataSource.Operations.TeamOperation.TeamOperationReadRepo.getByAssignee(command.organizationId, command.assigneeId);
	};

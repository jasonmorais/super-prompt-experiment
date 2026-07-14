import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const myOperations = (dataSources: DataSources) => async (command: { organizationId: string; assigneeId: string }): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference[]> => {
	const assignedOperations = await dataSources.readonlyDataSource.Operations.TeamOperation.TeamOperationReadRepo.getByAssignee(command.organizationId, command.assigneeId);
	const teamName = assignedOperations[0]?.teamName ?? (await dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.getByLearner(command.organizationId, command.assigneeId))[0]?.teamName;
	return teamName ? dataSources.readonlyDataSource.Operations.TeamOperation.TeamOperationReadRepo.listByOrganization(command.organizationId, teamName) : assignedOperations;
};

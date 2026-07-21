import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';

export interface TeamLearningCommand {
	organizationId: string;
	teamName?: string;
}

export const teamLearning =
	(dataSources: DataSources): ((command: TeamLearningCommand) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>) =>
	(command) =>
		dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.listByOrganization(command.organizationId, command.teamName);

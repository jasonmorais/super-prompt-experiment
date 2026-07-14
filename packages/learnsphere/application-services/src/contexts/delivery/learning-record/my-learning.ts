import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export interface MyLearningCommand {
	organizationId: string;
	learnerId: string;
}

export const myLearning =
	(dataSources: DataSources): ((command: MyLearningCommand) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>) =>
	(command) =>
		dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.getByLearner(command.organizationId, command.learnerId);

import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const trainingLeaderboard =
	(dataSources: DataSources) =>
	(command: { organizationId: string; limit?: number }): Promise<Domain.Contexts.Delivery.LearningRecord.TrainingLeaderboardEntry[]> =>
		dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.getTrainingLeaderboard(command.organizationId, command.limit);

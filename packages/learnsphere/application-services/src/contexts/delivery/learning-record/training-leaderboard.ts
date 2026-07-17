import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const trainingLeaderboard = (dataSources: DataSources, passport: Domain.Passport) => (command: { organizationId: string; limit?: number }): Promise<Domain.Contexts.Delivery.LearningRecord.TrainingLeaderboardEntry[]> => {
	if (!passport.canAccessOrganization(command.organizationId)) throw new Error('You do not have access to this organization');
	return dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.getTrainingLeaderboard(command.organizationId, command.limit);
};

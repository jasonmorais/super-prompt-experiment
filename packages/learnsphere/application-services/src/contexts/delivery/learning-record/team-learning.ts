import type { DataSources } from '@learnsphere/persistence';
import type { Domain, Passport } from '@learnsphere/domain';

export interface TeamLearningCommand {
	organizationId: string;
	teamName?: string;
}

export const teamLearning =
	(dataSources: DataSources, passport: Passport): ((command: TeamLearningCommand) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>) =>
	(command) => {
		if (!passport.canViewTeamLearning) throw new Error('Manager or learning administrator role required');
		return dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.listByOrganization(command.organizationId, command.teamName);
	};

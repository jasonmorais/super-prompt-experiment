import type { DataSources } from '@learnsphere/persistence';
import type { Domain, Passport } from '@learnsphere/domain';

export interface TeamLearningCommand {
	organizationId: string;
	teamName?: string;
}

export const teamLearning =
	(dataSources: DataSources, passport: Passport): ((command: TeamLearningCommand) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>) =>
	(command) => {
		if (!passport.canViewTeamLearning || !passport.canAccessOrganization(command.organizationId)) throw new Error('You do not have access to team learning in this organization');
		return dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.listByOrganization(command.organizationId, command.teamName);
	};

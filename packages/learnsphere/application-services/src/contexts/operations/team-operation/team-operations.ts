import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const teamOperations = (dataSources: DataSources, passport: Domain.Passport) => (command: { organizationId: string; teamName?: string }): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference[]> => {
	if (!passport.canViewTeamLearning) throw new Error('Manager or learning administrator role required');
	return dataSources.readonlyDataSource.Operations.TeamOperation.TeamOperationReadRepo.listByOrganization(command.organizationId, command.teamName);
};

import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const teamOperations = (dataSources: DataSources, passport: Domain.Passport) => (command: { organizationId: string; teamName?: string }): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference[]> => {
	if (!passport.canViewTeamLearning || !passport.canAccessOrganization(command.organizationId)) throw new Error('You do not have access to team operations in this organization');
	return dataSources.readonlyDataSource.Operations.TeamOperation.TeamOperationReadRepo.listByOrganization(command.organizationId, command.teamName);
};

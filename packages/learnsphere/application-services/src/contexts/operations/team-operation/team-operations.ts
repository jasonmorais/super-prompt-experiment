import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const teamOperations = (dataSources: DataSources) => (command: { organizationId: string; teamName?: string }): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference[]> => dataSources.readonlyDataSource.Operations.TeamOperation.TeamOperationReadRepo.listByOrganization(command.organizationId, command.teamName);

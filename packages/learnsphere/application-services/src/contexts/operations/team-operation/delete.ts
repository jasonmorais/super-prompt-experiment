import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';
import { mutate } from './mutate.ts';

export const deleteOperation =
	(dataSources: DataSources) =>
	(command: { id: string }): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference> =>
		mutate(dataSources, command.id, (operation) => operation.delete());

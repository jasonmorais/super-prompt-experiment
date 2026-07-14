import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { mutate } from './mutate.ts';

export const cancel = (dataSources: DataSources) => (command: { id: string; actorId: string; reason: string }): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference> => mutate(dataSources, command.id, (operation) => operation.cancel(command.actorId, command.reason));

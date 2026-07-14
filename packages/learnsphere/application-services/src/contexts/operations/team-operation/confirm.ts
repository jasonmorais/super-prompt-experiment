import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { mutate } from './mutate.ts';

export const confirm = (dataSources: DataSources) => (command: { id: string; actorId: string; note?: string }): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference> => mutate(dataSources, command.id, (operation) => operation.confirm(command.actorId, command.note));

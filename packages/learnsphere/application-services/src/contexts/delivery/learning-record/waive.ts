import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';
import { mutate } from './mutate.ts';

export interface WaiveLearningCommand {
	id: string;
	reason: string;
}

export const waive =
	(dataSources: DataSources): ((command: WaiveLearningCommand) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>) =>
	(command) =>
		mutate(dataSources, command.id, (record) => record.waive(command.reason));

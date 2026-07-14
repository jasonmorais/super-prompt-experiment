import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';
import { mutate } from './mutate.ts';

export interface RecordActivityCommand {
	id: string;
	activityKey: string;
	timeSpentMinutes: number;
	assessmentScore?: number;
	completionScreenshot?: string;
}

export const recordActivity =
	(dataSources: DataSources): ((command: RecordActivityCommand) => Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>) =>
	(command) =>
		mutate(dataSources, command.id, (record) => record.recordActivity(command.activityKey, command.timeSpentMinutes, command.assessmentScore, command.completionScreenshot));

import type { DataSources } from '@learnsphere/persistence';
import type { Passport } from '@learnsphere/domain';
import { LearningRecord, type LearningRecordApplicationService } from './learning-record/index.ts';

export interface DeliveryContextApplicationService {
	LearningRecord: LearningRecordApplicationService;
}

export const Delivery = (dataSources: DataSources, passport: Passport, identity: { sub: string; email?: string; given_name?: string; family_name?: string }): DeliveryContextApplicationService => ({
	LearningRecord: LearningRecord(dataSources, passport, identity),
});

import type { DataSources } from '@learnsphere/persistence';
import { LearningRecord, type LearningRecordApplicationService } from './learning-record/index.ts';
import { AssessmentAttempt, type AssessmentAttemptApplicationService } from './assessment-attempt/index.ts';

export interface DeliveryContextApplicationService {
	LearningRecord: LearningRecordApplicationService;
	AssessmentAttempt: AssessmentAttemptApplicationService;
}

export const Delivery = (dataSources: DataSources, identity: { sub: string; email?: string; given_name?: string; family_name?: string }): DeliveryContextApplicationService => ({
	LearningRecord: LearningRecord(dataSources, identity),
	AssessmentAttempt: AssessmentAttempt(dataSources, identity.sub),
});

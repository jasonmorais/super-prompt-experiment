import type { LearningRecordEntityReference } from './learning-record/learning-record.ts';
import type { LearningRecordVisa } from './learning-record/learning-record.visa.ts';
export interface DeliveryPassport {
	forLearningRecord(record: LearningRecordEntityReference): LearningRecordVisa;
}

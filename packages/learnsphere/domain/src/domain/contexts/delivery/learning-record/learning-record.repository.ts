import type { Repository } from '@cellix/domain-seedwork/repository';
import type { LearningRecord, LearningRecordProps } from './learning-record.ts';

export type NewLearningRecordInput = Parameters<typeof LearningRecord.getNewInstance>[1];
export interface LearningRecordRepository<Props extends LearningRecordProps = LearningRecordProps> extends Repository<LearningRecord<Props>> {
	getNewInstance(input: NewLearningRecordInput): Promise<LearningRecord<Props>>;
}

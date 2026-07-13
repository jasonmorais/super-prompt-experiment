import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../../passport-factory.ts';
import type { LearningRecord, LearningRecordProps } from './learning-record.ts';
import type { LearningRecordRepository } from './learning-record.repository.ts';

export interface LearningRecordUnitOfWork extends UnitOfWork<Passport, LearningRecordProps, LearningRecord, LearningRecordRepository>, InitializedUnitOfWork<Passport, LearningRecordProps, LearningRecord, LearningRecordRepository> {}

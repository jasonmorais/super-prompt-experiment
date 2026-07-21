import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getLearningRecordReadRepository } from './learning-record.read-repository.ts';

export type { LearningRecordReadRepository } from './learning-record.read-repository.ts';

export const LearningRecordContext = (models: ModelsContext, passport: Domain.Passport) => ({
	LearningRecordReadRepo: getLearningRecordReadRepository(models, passport),
});

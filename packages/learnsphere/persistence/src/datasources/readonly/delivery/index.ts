import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../index.ts';
import { LearningRecordContext } from './learning-record/index.ts';
import { AssessmentAttemptContext } from './assessment-attempt/index.ts';

export const DeliveryContext = (models: ModelsContext, passport: Domain.Passport) => ({
	LearningRecord: LearningRecordContext(models, passport),
	AssessmentAttempt: AssessmentAttemptContext(models, passport),
});

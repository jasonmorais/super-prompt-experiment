import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getAssessmentAttemptReadRepository, type AssessmentAttemptReadRepository } from './assessment-attempt.read-repository.ts';
export type { AssessmentAttemptReadRepository } from './assessment-attempt.read-repository.ts';
export const AssessmentAttemptContext = (models: ModelsContext, passport: Domain.Passport): { AssessmentAttemptReadRepo: AssessmentAttemptReadRepository } => ({
	AssessmentAttemptReadRepo: getAssessmentAttemptReadRepository(models, passport),
});

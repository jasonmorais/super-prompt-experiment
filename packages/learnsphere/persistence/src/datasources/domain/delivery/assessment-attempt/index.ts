import type { Domain } from '@learnsphere/domain'; import type { ModelsContext } from '../../../../index.ts'; import { getAssessmentAttemptUnitOfWork } from './assessment-attempt.uow.ts';
export const AssessmentAttemptPersistence = (models: ModelsContext, passport: Domain.Passport) => ({ AssessmentAttemptUnitOfWork: getAssessmentAttemptUnitOfWork(models.AssessmentAttempt, passport) });

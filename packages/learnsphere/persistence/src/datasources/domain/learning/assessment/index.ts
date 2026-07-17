import type { Domain } from '@learnsphere/domain'; import type { ModelsContext } from '../../../../index.ts'; import { getAssessmentUnitOfWork } from './assessment.uow.ts';
export const AssessmentPersistence = (models: ModelsContext, passport: Domain.Passport) => ({ AssessmentUnitOfWork: getAssessmentUnitOfWork(models.Assessment, passport) });

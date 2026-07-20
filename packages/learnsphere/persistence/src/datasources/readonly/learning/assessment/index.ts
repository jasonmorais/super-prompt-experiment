import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getAssessmentReadRepository, type AssessmentReadRepository } from './assessment.read-repository.ts';
export type { AssessmentReadRepository } from './assessment.read-repository.ts';
export const AssessmentContext = (models: ModelsContext, passport: Domain.Passport): { AssessmentReadRepo: AssessmentReadRepository } => ({ AssessmentReadRepo: getAssessmentReadRepository(models, passport) });

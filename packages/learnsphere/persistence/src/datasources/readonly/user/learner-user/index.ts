import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getLearnerUserReadRepository, type LearnerUserReadRepository } from './learner-user.read-repository.ts';
export type { LearnerUserReadRepository } from './learner-user.read-repository.ts';
export const LearnerUserReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport): { LearnerUserReadRepo: LearnerUserReadRepository } => ({ LearnerUserReadRepo: getLearnerUserReadRepository(models, passport) });

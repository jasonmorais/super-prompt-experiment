import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getLearnerUserUnitOfWork } from './learner-user.uow.ts';

export const LearnerUserPersistence = (models: ModelsContext, passport: Domain.Passport) => ({ LearnerUserUnitOfWork: getLearnerUserUnitOfWork(models.LearnerUser, passport) });

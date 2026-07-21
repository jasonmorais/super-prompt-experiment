import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { LearnerUser, LearnerUserProps } from './learner-user.ts';
import type { LearnerUserRepository } from './learner-user.repository.ts';

export interface LearnerUserUnitOfWork extends UnitOfWork<Passport, LearnerUserProps, LearnerUser<LearnerUserProps>, LearnerUserRepository<LearnerUserProps>>, InitializedUnitOfWork<Passport, LearnerUserProps, LearnerUser<LearnerUserProps>, LearnerUserRepository<LearnerUserProps>> {}

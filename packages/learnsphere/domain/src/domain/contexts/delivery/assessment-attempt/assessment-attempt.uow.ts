import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../../passport-factory.ts';
import type { AssessmentAttempt, AssessmentAttemptProps } from './assessment-attempt.ts';
import type { AssessmentAttemptRepository } from './assessment-attempt.repository.ts';
export interface AssessmentAttemptUnitOfWork extends UnitOfWork<Passport, AssessmentAttemptProps, AssessmentAttempt<AssessmentAttemptProps>, AssessmentAttemptRepository<AssessmentAttemptProps>>, InitializedUnitOfWork<Passport, AssessmentAttemptProps, AssessmentAttempt<AssessmentAttemptProps>, AssessmentAttemptRepository<AssessmentAttemptProps>> {}

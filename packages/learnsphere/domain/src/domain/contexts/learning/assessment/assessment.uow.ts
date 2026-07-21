import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../../passport-factory.ts';
import type { Assessment, AssessmentProps } from './assessment.ts';
import type { AssessmentRepository } from './assessment.repository.ts';
export interface AssessmentUnitOfWork extends UnitOfWork<Passport, AssessmentProps, Assessment<AssessmentProps>, AssessmentRepository<AssessmentProps>>, InitializedUnitOfWork<Passport, AssessmentProps, Assessment<AssessmentProps>, AssessmentRepository<AssessmentProps>> {}

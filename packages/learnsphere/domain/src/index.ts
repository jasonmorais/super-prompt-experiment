export * as Domain from './domain/index.ts';
export type { Passport } from './domain/passport-factory.ts';
import type { CourseUnitOfWork } from './domain/contexts/learning/course/course.uow.ts';
import type { LearningRecordUnitOfWork } from './domain/contexts/delivery/learning-record/learning-record.uow.ts';
import type { TeamOperationUnitOfWork } from './domain/contexts/operations/team-operation/team-operation.uow.ts';

/**
 * Aggregate of the domain's unit-of-work data sources. It is built by the
 * persistence layer and handed to event-handler registration at startup.
 *
 * New bounded contexts expose their unit-of-work types through this contract.
 */
export interface DomainDataSource {
	Delivery: { LearningRecord: { LearningRecordUnitOfWork: LearningRecordUnitOfWork } };
	Learning: { Course: { CourseUnitOfWork: CourseUnitOfWork } };
	Operations: { TeamOperation: { TeamOperationUnitOfWork: TeamOperationUnitOfWork } };
}

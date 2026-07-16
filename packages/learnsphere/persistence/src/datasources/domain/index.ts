import type { Domain, DomainDataSource } from '@learnsphere/domain';
import type { ModelsContext } from '../../index.ts';
import { getLearningRecordUnitOfWork } from './delivery/learning-record/learning-record.uow.ts';
import { getCourseUnitOfWork } from './learning/course/course.uow.ts';
import { getTeamOperationUnitOfWork } from './operations/team-operation/team-operation.uow.ts';
import { UserContextPersistence } from './user/index.ts';

export const DomainDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): DomainDataSource => ({
	Delivery: { LearningRecord: { LearningRecordUnitOfWork: getLearningRecordUnitOfWork(models.LearningRecord, passport) } },
	Learning: { Course: { CourseUnitOfWork: getCourseUnitOfWork(models.Course, passport) } },
	Operations: { TeamOperation: { TeamOperationUnitOfWork: getTeamOperationUnitOfWork(models.TeamOperation, passport) } },
	User: UserContextPersistence(models, passport),
});

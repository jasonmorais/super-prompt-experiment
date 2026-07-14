import { Domain, type DomainDataSource, type Passport } from '@learnsphere/domain';
import type { ModelsContext } from '../index.ts';
import { getLearningRecordUnitOfWork } from './domain/delivery/learning-record/learning-record.uow.ts';
import { getCourseUnitOfWork } from './domain/learning/course/course.uow.ts';
import { getTeamOperationUnitOfWork } from './domain/operations/team-operation/team-operation.uow.ts';
import { ReadonlyDataSourceImplementation, type ReadonlyDataSource } from './readonly/index.ts';

export type DataSources = { readonly domainDataSource: DomainDataSource; readonly readonlyDataSource: ReadonlyDataSource };
export type DataSourcesFactory = { withPassport(passport: Passport): DataSources; withSystemPassport(): DataSources };
export type { ReadonlyDataSource } from './readonly/index.ts';

const domainDataSourceImplementation = (models: ModelsContext, passport: Passport): DomainDataSource => ({
	Delivery: { LearningRecord: { LearningRecordUnitOfWork: getLearningRecordUnitOfWork(models.LearningRecord, passport) } },
	Learning: { Course: { CourseUnitOfWork: getCourseUnitOfWork(models.Course, passport) } },
	Operations: { TeamOperation: { TeamOperationUnitOfWork: getTeamOperationUnitOfWork(models.TeamOperation, passport) } },
});

export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
	const withPassport = (passport: Passport): DataSources => ({
		domainDataSource: domainDataSourceImplementation(models, passport),
		readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
	});
	return {
		withPassport,
		withSystemPassport: () => withPassport(Domain.PassportFactory.forSystem()),
	};
};

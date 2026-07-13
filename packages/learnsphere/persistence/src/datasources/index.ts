import { Domain, type DomainDataSource, type Passport } from '@learnsphere/domain';
import type { ModelsContext } from '../index.ts';
import { CourseConverter } from './domain/learning/course/course.domain-adapter.ts';
import { getCourseUnitOfWork } from './domain/learning/course/course.uow.ts';
import { LearningRecordConverter } from './domain/delivery/learning-record/learning-record.domain-adapter.ts';
import { getLearningRecordUnitOfWork } from './domain/delivery/learning-record/learning-record.uow.ts';

export interface CourseListOptions {
	organizationId: string;
	status?: Domain.Contexts.Learning.Course.CourseStatus;
	search?: string;
	limit?: number;
}

export interface ReadonlyDataSource {
	Delivery: {
		LearningRecord: {
			LearningRecordReadRepo: {
				getById(id: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference | null>;
				getByLearner(organizationId: string, learnerId: string): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>;
			};
		};
	};
	Learning: {
		Course: {
			CourseReadRepo: {
				getById(id: string): Promise<Domain.Contexts.Learning.Course.CourseEntityReference | null>;
				list(options: CourseListOptions): Promise<Domain.Contexts.Learning.Course.CourseEntityReference[]>;
			};
		};
	};
}

/** Passport-scoped read/write data sources handed to application services. */
export interface DataSources {
	readonly domainDataSource: DomainDataSource;
	readonly readonlyDataSource: ReadonlyDataSource;
}

/** Produces {@link DataSources} scoped to a caller's {@link Passport}. */
export interface DataSourcesFactory {
	withPassport(passport: Passport): DataSources;
	withSystemPassport(): DataSources;
}

/**
 * Every data source is scoped to the request passport before it reaches
 * application services.
 */
export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
	const build = (passport: Passport): DataSources => ({
		domainDataSource: {
			Delivery: { LearningRecord: { LearningRecordUnitOfWork: getLearningRecordUnitOfWork(models.LearningRecord, passport) } },
			Learning: { Course: { CourseUnitOfWork: getCourseUnitOfWork(models.Course, passport) } },
		},
		readonlyDataSource: {
			Delivery: {
				LearningRecord: {
					LearningRecordReadRepo: {
						async getById(id) {
							const document = await models.LearningRecord.findById(id).exec();
							return document ? new LearningRecordConverter().toDomain(document, passport) : null;
						},
						async getByLearner(organizationId, learnerId) {
							const documents = await models.LearningRecord.find({ organizationId, learnerId }).sort({ updatedAt: -1 }).exec();
							const converter = new LearningRecordConverter();
							return documents.map((document) => converter.toDomain(document, passport));
						},
					},
				},
			},
			Learning: {
				Course: {
					CourseReadRepo: {
						async getById(id) {
							const document = await models.Course.findById(id).exec();
							return document ? new CourseConverter().toDomain(document, passport) : null;
						},
						async list(options) {
							const query: { organizationId: string; status?: Domain.Contexts.Learning.Course.CourseStatus; $text?: { $search: string } } = { organizationId: options.organizationId };
							if (options.status) query.status = options.status;
							if (options.search?.trim()) query.$text = { $search: options.search.trim() };
							const documents = await models.Course.find(query).sort({ updatedAt: -1 }).limit(Math.min(options.limit ?? 30, 100)).exec();
							const converter = new CourseConverter();
							return documents.map((document) => converter.toDomain(document, passport));
						},
					},
				},
			},
		},
	});
	return {
		withPassport: (passport: Passport): DataSources => build(passport),
		withSystemPassport: (): DataSources => build(Domain.PassportFactory.forSystem()),
	};
};

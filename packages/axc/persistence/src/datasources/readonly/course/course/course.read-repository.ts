import { Domain } from '@axc/domain';
import type { ModelsContext } from '../../../../index.ts';
import { CourseConverter } from '../../../domain/course/course/course.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { type CourseDataSource, CourseDataSourceImpl } from './course.data.ts';

/**
 * Read repository for the Course aggregate. Mirrors the Community context's
 * `community.read-repository.ts`: wraps the read-model data source and maps
 * lean documents into domain entity references via the converter.
 */
export interface CourseReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Course.Course.CourseEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Course.Course.CourseEntityReference | null>;
}

export class CourseReadRepositoryImpl implements CourseReadRepository {
	private readonly mongoDataSource: CourseDataSource;
	private readonly converter: CourseConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new CourseDataSourceImpl(models.Course);
		this.converter = new CourseConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Course.Course.CourseEntityReference[]> {
		const finalOptions: FindOptions = { sort: { title: 1 }, ...options };
		const result = await this.mongoDataSource.find({}, finalOptions);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Course.Course.CourseEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export const getCourseReadRepository = (models: ModelsContext, passport: Domain.Passport): CourseReadRepository => {
	return new CourseReadRepositoryImpl(models, passport);
};

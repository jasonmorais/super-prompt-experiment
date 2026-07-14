import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { CourseConverter } from '../../../domain/learning/course/course.domain-adapter.ts';

export interface CourseListOptions {
	organizationId: string;
	status?: Domain.Contexts.Learning.Course.CourseStatus;
	search?: string;
	limit?: number;
}

export interface CourseReadRepository {
	getById(id: string): Promise<Domain.Contexts.Learning.Course.CourseEntityReference | null>;
	list(options: CourseListOptions): Promise<Domain.Contexts.Learning.Course.CourseEntityReference[]>;
}

export class CourseReadRepositoryImpl implements CourseReadRepository {
	private readonly converter = new CourseConverter();
	private readonly models: ModelsContext;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.models = models;
		this.passport = passport;
	}

	async getById(id: string): Promise<Domain.Contexts.Learning.Course.CourseEntityReference | null> {
		const document = await this.models.Course.findById(id).exec();
		return document ? this.converter.toDomain(document, this.passport) : null;
	}

	async list(options: CourseListOptions): Promise<Domain.Contexts.Learning.Course.CourseEntityReference[]> {
		const query: { organizationId: string; status?: Domain.Contexts.Learning.Course.CourseStatus; $text?: { $search: string } } = { organizationId: options.organizationId };
		if (options.status) query.status = options.status;
		if (options.search?.trim()) query.$text = { $search: options.search.trim() };
		const documents = await this.models.Course.find(query)
			.sort({ updatedAt: -1 })
			.limit(Math.min(options.limit ?? 30, 100))
			.exec();
		return documents.map((document) => this.converter.toDomain(document, this.passport));
	}
}

export const getCourseReadRepository = (models: ModelsContext, passport: Domain.Passport): CourseReadRepository => new CourseReadRepositoryImpl(models, passport);

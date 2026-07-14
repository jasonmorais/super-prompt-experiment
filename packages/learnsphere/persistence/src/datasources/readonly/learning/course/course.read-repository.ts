import type { Domain } from '@learnsphere/domain';
import type { Course as CourseDocument } from '@learnsphere/data-sources-mongoose-models';
import type { FilterQuery } from 'mongoose';
import type { ModelsContext } from '../../../../index.ts';
import { CourseConverter } from '../../../domain/learning/course/course.domain-adapter.ts';

export interface CourseListOptions {
	organizationId: string;
	status?: Domain.Contexts.Learning.Course.CourseStatus;
	search?: string;
	limit?: number;
	learnerId?: string;
}

export interface CourseReadRepository {
	getById(id: string, options?: { organizationId?: string; learnerId?: string }): Promise<Domain.Contexts.Learning.Course.CourseEntityReference | null>;
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

	async getById(id: string, options?: { organizationId?: string; learnerId?: string }): Promise<Domain.Contexts.Learning.Course.CourseEntityReference | null> {
		const document = await this.models.Course.findOne({ _id: id, ...(options?.organizationId ? { organizationId: options.organizationId } : {}), ...(options?.learnerId ? { $or: [{ discoverability: 'CATALOG' }, { discoverability: 'ASSIGNED_ONLY', _id: { $in: await this.assignedCourseIds(options.organizationId, options.learnerId) } }] } : {}) }).exec();
		return document ? this.converter.toDomain(document, this.passport) : null;
	}

	async list(options: CourseListOptions): Promise<Domain.Contexts.Learning.Course.CourseEntityReference[]> {
		const query: FilterQuery<CourseDocument> = { organizationId: options.organizationId };
		if (options.status) query.status = options.status;
		if (options.search?.trim()) query.$text = { $search: options.search.trim() };
		if (options.learnerId) query.$or = [{ discoverability: 'CATALOG' }, { discoverability: 'ASSIGNED_ONLY', _id: { $in: await this.assignedCourseIds(options.organizationId, options.learnerId) } }];
		const documents = await this.models.Course.find(query)
			.sort({ updatedAt: -1 })
			.limit(Math.min(options.limit ?? 30, 100))
			.exec();
		return documents.map((document) => this.converter.toDomain(document, this.passport));
	}

	private async assignedCourseIds(organizationId: string | undefined, learnerId: string): Promise<string[]> {
		if (!organizationId) return [];
		const records = await this.models.LearningRecord.find({ organizationId, learnerId, source: { $ne: 'SELF_ENROLLED' } }).select({ courseId: 1 }).lean().exec();
		return records.map((record) => record.courseId);
	}
}

export const getCourseReadRepository = (models: ModelsContext, passport: Domain.Passport): CourseReadRepository => new CourseReadRepositoryImpl(models, passport);

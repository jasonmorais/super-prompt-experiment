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
		if (options?.organizationId && !this.passport.canAccessOrganization(options.organizationId)) return null;
		const document = await this.models.Course.findOne({
			_id: id,
			...(options?.organizationId ? { organizationId: options.organizationId } : {}),
			...(options?.learnerId
				? {
						$or: [
							// Older local seed data predates the discoverability field and was
							// intended to be catalog-visible.
							{ discoverability: { $in: ['CATALOG', null] } },
							{ discoverability: 'ASSIGNED_ONLY', _id: { $in: await this.assignedCourseIds(options.organizationId, options.learnerId) } },
						],
					}
				: {}),
		})
			.populate('modules.lessons.assessment')
			.exec();
		return document && this.passport.canAccessOrganization(document.organizationId) ? this.converter.toDomain(document, this.passport) : null;
	}

	async list(options: CourseListOptions): Promise<Domain.Contexts.Learning.Course.CourseEntityReference[]> {
		if (!this.passport.canAccessOrganization(options.organizationId)) throw new Error('You do not have access to this organization');
		const query: FilterQuery<CourseDocument> = { organizationId: options.organizationId };
		if (options.status) query.status = options.status;
		if (options.search?.trim()) query.$text = { $search: options.search.trim() };
		if (options.learnerId) {
			query.$or = [{ discoverability: { $in: ['CATALOG', null] } }, { discoverability: 'ASSIGNED_ONLY', _id: { $in: await this.assignedCourseIds(options.organizationId, options.learnerId) } }];
		}
		const documents = await this.models.Course.find(query)
			.populate('modules.lessons.assessment')
			.sort({ updatedAt: -1 })
			.limit(Math.min(options.limit ?? 30, 100))
			.exec();
		return documents.map((document) => this.converter.toDomain(document, this.passport));
	}

	private async assignedCourseIds(organizationId: string | undefined, learnerId: string): Promise<string[]> {
		if (!organizationId) return [];
		const records = await this.models.LearningRecord.find({ organizationId, learnerId, source: { $ne: 'SELF_ENROLLED' } })
			.select({ courseId: 1 })
			.lean()
			.exec();
		return records.map((record) => record.courseId);
	}
}

export const getCourseReadRepository = (models: ModelsContext, passport: Domain.Passport): CourseReadRepository => new CourseReadRepositoryImpl(models, passport);

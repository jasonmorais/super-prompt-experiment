import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Course } from '@axc/data-sources-mongoose-models';
import { Domain } from '@axc/domain';
import type { CourseDomainAdapter } from './course.domain-adapter.ts';

type PropType = CourseDomainAdapter;

/**
 * Write-side repository for the Course aggregate. Mirrors the Community
 * context's persistence `community.repository.ts`: extends
 * {@link MongooseSeedwork.MongoRepositoryBase} (get/save/transactional) and
 * implements the domain repository interface.
 */
export class CourseRepository extends MongooseSeedwork.MongoRepositoryBase<Course, PropType, Domain.Passport, Domain.Contexts.Course.Course.Course<PropType>> implements Domain.Contexts.Course.Course.CourseRepository<PropType> {
	// biome-ignore lint:noRequireAwait — factory returns a promise to match the domain contract.
	async getNewInstance(title: string, summary: string, modality: Domain.Contexts.Course.Course.CourseModality): Promise<Domain.Contexts.Course.Course.Course<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(Domain.Contexts.Course.Course.Course.getNewInstance(adapter, title, summary, modality, this.passport));
	}
}

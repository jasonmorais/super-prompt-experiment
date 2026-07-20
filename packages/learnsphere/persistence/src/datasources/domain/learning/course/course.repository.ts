import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Course as CourseDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
import type { CourseDomainAdapter } from './course.domain-adapter.ts';

export class CourseRepository
	extends MongooseSeedwork.MongoRepositoryBase<CourseDocument, CourseDomainAdapter, Domain.Passport, Domain.Contexts.Learning.Course.Course<CourseDomainAdapter>>
	implements Domain.Contexts.Learning.Course.CourseRepository<CourseDomainAdapter>
{
	override async get(id: string) {
		const document = await this.model.findById(id).populate('modules.lessons.assessment').exec();
		if (!document) throw new Error(`Course with id ${id} not found`);
		return this.typeConverter.toDomain(document, this.passport);
	}
	override async save(item: Domain.Contexts.Learning.Course.Course<CourseDomainAdapter>) {
		const saved = await super.save(item);
		return saved.isDeleted ? saved : this.get(saved.id);
	}
	getNewInstance(input: Domain.Contexts.Learning.Course.NewCourseInput) {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(Domain.Contexts.Learning.Course.Course.getNewInstance(adapter, input, this.passport));
	}
}

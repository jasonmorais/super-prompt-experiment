import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Course } from '@axc/data-sources-mongoose-models';
import { Domain } from '@axc/domain';

/**
 * Bridges the Mongoose `Course` document to the domain `Course` aggregate.
 * Mirrors the Community context's `community.domain-adapter.ts`.
 */
export class CourseConverter extends MongooseSeedwork.MongoTypeConverter<Course, CourseDomainAdapter, Domain.Passport, Domain.Contexts.Course.Course.Course<CourseDomainAdapter>> {
	constructor() {
		super(CourseDomainAdapter, Domain.Contexts.Course.Course.Course);
	}
}

export class CourseDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<Course> implements Domain.Contexts.Course.Course.CourseProps {
	get title() {
		return this.doc.title;
	}
	set title(title: string) {
		this.doc.title = title;
	}

	get summary() {
		return this.doc.summary;
	}
	set summary(summary: string) {
		this.doc.summary = summary;
	}

	get modality(): Domain.Contexts.Course.Course.CourseModality {
		return this.doc.modality as Domain.Contexts.Course.Course.CourseModality;
	}
	set modality(modality: Domain.Contexts.Course.Course.CourseModality) {
		this.doc.modality = modality;
	}

	get status(): Domain.Contexts.Course.Course.CourseStatus {
		return this.doc.status as Domain.Contexts.Course.Course.CourseStatus;
	}
	set status(status: Domain.Contexts.Course.Course.CourseStatus) {
		this.doc.status = status;
	}

	get tags(): string[] {
		return this.doc.tags;
	}
	set tags(tags: string[]) {
		this.doc.tags = tags;
	}
}

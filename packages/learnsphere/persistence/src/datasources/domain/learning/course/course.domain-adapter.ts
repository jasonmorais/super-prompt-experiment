import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Course as CourseDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';

export class CourseConverter extends MongooseSeedwork.MongoTypeConverter<CourseDocument, CourseDomainAdapter, Domain.Passport, Domain.Contexts.Learning.Course.Course<CourseDomainAdapter>> {
	constructor() { super(CourseDomainAdapter, Domain.Contexts.Learning.Course.Course); }
}

export class CourseDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<CourseDocument> implements Domain.Contexts.Learning.Course.CourseProps {
	get organizationId() { return this.doc.organizationId; }
	set organizationId(value) { this.doc.organizationId = value; }
	get title() { return this.doc.title; }
	set title(value) { this.doc.title = value; }
	get summary() { return this.doc.summary; }
	set summary(value) { this.doc.summary = value; }
	get description() { return this.doc.description; }
	set description(value) { this.doc.description = value; }
	get status() { return this.doc.status; }
	set status(value) { this.doc.status = value; }
	get level() { return this.doc.level; }
	set level(value) { this.doc.level = value; }
	get category() { return this.doc.category; }
	set category(value) { this.doc.category = value; }
	get tags() { return this.doc.tags; }
	set tags(value) { this.doc.tags = value; }
	get skills() { return this.doc.skills; }
	set skills(value) { this.doc.skills = value; }
	get modules(): Domain.Contexts.Learning.Course.CourseModule[] {
		return this.doc.modules.map((module) => ({
			key: module.key,
			title: module.title,
			description: module.description,
			order: module.order,
			lessons: module.lessons.map((lesson) => ({
				key: lesson.key,
				title: lesson.title,
				type: lesson.type,
				estimatedMinutes: lesson.estimatedMinutes,
				required: lesson.required,
			})),
		}));
	}
	set modules(value) { this.doc.modules = value; }
	get createdBy() { return this.doc.createdBy; }
	set createdBy(value) { this.doc.createdBy = value; }
	get publishedAt() { return this.doc.publishedAt; }
	set publishedAt(value) { this.doc.publishedAt = value; }
}

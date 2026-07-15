import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../../passport-factory.ts';

export type CourseStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type CourseLevel = 'FOUNDATIONAL' | 'INTERMEDIATE' | 'ADVANCED';
export type LessonType = 'ARTICLE' | 'VIDEO' | 'QUIZ' | 'PROJECT' | 'RESOURCE';
export type CourseDiscoverability = 'CATALOG' | 'ASSIGNED_ONLY';

export interface Lesson {
	key: string;
	title: string;
	type: LessonType;
	content: string;
	estimatedMinutes: number;
	required: boolean;
}

export interface CourseModule {
	key: string;
	title: string;
	description: string;
	order: number;
	lessons: Lesson[];
}

export interface CourseProps extends DomainEntityProps {
	organizationId: string;
	title: string;
	summary: string;
	description: string;
	status: CourseStatus;
	level: CourseLevel;
	category: string;
	tags: string[];
	skills: string[];
	discoverability: CourseDiscoverability;
	requiresCompletionScreenshot: boolean;
	modules: CourseModule[];
	createdBy: string;
	publishedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	schemaVersion: string;
}

export interface CourseEntityReference extends Readonly<CourseProps> {
	estimatedMinutes: number;
	lessonCount: number;
}

const requiredText = (value: string, field: string, maxLength: number): string => {
	const normalized = value.trim();
	if (!normalized) throw new Error(`${field} is required`);
	if (normalized.length > maxLength) throw new Error(`${field} cannot exceed ${maxLength} characters`);
	return normalized;
};

export class Course<Props extends CourseProps = CourseProps> extends AggregateRoot<Props, Passport> implements CourseEntityReference {
	private isNew = false;

	static getNewInstance<Props extends CourseProps>(props: Props, input: Pick<CourseProps, 'organizationId' | 'title' | 'summary' | 'description' | 'level' | 'category' | 'createdBy' | 'discoverability' | 'requiresCompletionScreenshot'>, passport: Passport): Course<Props> {
		const course = new Course(props, passport);
		if (!passport.learning.forCourse(course).determineIf((permissions) => permissions.canCreateCourses)) throw new PermissionError('You do not have permission to create courses');
		course.isNew = true;
		course.organizationId = input.organizationId;
		course.title = input.title;
		course.summary = input.summary;
		course.description = input.description;
		course.level = input.level;
		course.category = input.category;
		course.createdBy = input.createdBy;
		course.props.status = 'DRAFT';
		course.props.tags = [];
		course.props.skills = [];
		course.props.discoverability = input.discoverability;
		course.props.requiresCompletionScreenshot = input.requiresCompletionScreenshot;
		course.props.modules = [];
		course.props.publishedAt = null;
		course.isNew = false;
		return course;
	}

	private get visa() {
		return this.passport.learning.forCourse(this);
	}
	private requireManagement(): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageLearningContent)) throw new PermissionError('You do not have permission to manage this course');
	}

	get organizationId() {
		return this.props.organizationId;
	}
	private set organizationId(value: string) {
		this.props.organizationId = requiredText(value, 'Organization', 100);
	}
	get title() {
		return this.props.title;
	}
	set title(value: string) {
		this.requireManagement();
		this.props.title = requiredText(value, 'Title', 180);
	}
	get summary() {
		return this.props.summary;
	}
	set summary(value: string) {
		this.requireManagement();
		this.props.summary = requiredText(value, 'Summary', 300);
	}
	get description() {
		return this.props.description;
	}
	set description(value: string) {
		this.requireManagement();
		this.props.description = requiredText(value, 'Description', 10000);
	}
	get status() {
		return this.props.status;
	}
	get level() {
		return this.props.level;
	}
	set level(value: CourseLevel) {
		this.requireManagement();
		this.props.level = value;
	}
	get category() {
		return this.props.category;
	}
	set category(value: string) {
		this.requireManagement();
		this.props.category = requiredText(value, 'Category', 100);
	}
	get tags() {
		return [...this.props.tags];
	}
	get skills() {
		return [...this.props.skills];
	}
	get discoverability() {
		return this.props.discoverability;
	}
	set discoverability(value: CourseDiscoverability) {
		this.requireManagement();
		this.props.discoverability = value;
	}
	get requiresCompletionScreenshot() {
		return this.props.requiresCompletionScreenshot;
	}
	set requiresCompletionScreenshot(value: boolean) {
		this.requireManagement();
		this.props.requiresCompletionScreenshot = value;
	}
	get modules() {
		return this.props.modules.map((module) => ({ ...module, lessons: module.lessons.map((lesson) => ({ ...lesson })) }));
	}
	get createdBy() {
		return this.props.createdBy;
	}
	private set createdBy(value: string) {
		this.props.createdBy = requiredText(value, 'Creator', 150);
	}
	get publishedAt() {
		return this.props.publishedAt;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
	get schemaVersion() {
		return this.props.schemaVersion;
	}
	get lessonCount() {
		return this.props.modules.reduce((count, module) => count + module.lessons.length, 0);
	}
	get estimatedMinutes() {
		return this.props.modules.reduce((total, module) => total + module.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0), 0);
	}

	setTaxonomy(tags: string[], skills: string[]): void {
		this.requireManagement();
		this.props.tags = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 20);
		this.props.skills = [...new Set(skills.map((skill) => skill.trim()).filter(Boolean))].slice(0, 20);
	}

	updateDetails(input: { title: string; summary: string; description: string; level: CourseLevel; category: string; tags: string[]; skills: string[]; discoverability: CourseDiscoverability; requiresCompletionScreenshot: boolean }): void {
		this.requireManagement();
		if (this.props.status === 'ARCHIVED') throw new Error('Archived courses cannot be edited');
		this.title = input.title;
		this.summary = input.summary;
		this.description = input.description;
		this.level = input.level;
		this.category = input.category;
		this.setTaxonomy(input.tags, input.skills);
		this.discoverability = input.discoverability;
		this.requiresCompletionScreenshot = input.requiresCompletionScreenshot;
	}

	addModule(module: Omit<CourseModule, 'order'>): void {
		this.requireManagement();
		if (this.props.status === 'PUBLISHED' || this.props.status === 'ARCHIVED') throw new Error('Published or archived courses cannot be structurally edited');
		if (this.props.modules.some((existing) => existing.key === module.key)) throw new Error(`Module key ${module.key} already exists`);
		if (module.lessons.length === 0) throw new Error('A module must contain at least one lesson');
		for (const lesson of module.lessons) {
			requiredText(lesson.title, 'Lesson title', 180);
			requiredText(lesson.content, 'Lesson content', 50000);
			if (lesson.estimatedMinutes < 1 || lesson.estimatedMinutes > 1440) throw new Error('Lesson duration must be between 1 and 1440 minutes');
		}
		// Mongoose-backed adapters return a defensive copy for nested arrays. Assign
		// the new collection through the props setter so Mongoose marks `modules`
		// modified and persists the complete aggregate change.
		this.props.modules = [...this.props.modules, { ...module, title: requiredText(module.title, 'Module title', 180), description: module.description.trim(), order: this.props.modules.length + 1 }];
	}

	submitForReview(): void {
		this.requireManagement();
		if (this.props.status !== 'DRAFT') throw new Error('Only draft courses can be submitted for review');
		if (this.lessonCount === 0) throw new Error('A course must contain learning activities before review');
		this.props.status = 'IN_REVIEW';
	}

	publish(): void {
		if (!this.visa.determineIf((permissions) => permissions.canPublishCourses)) throw new PermissionError('You do not have permission to publish courses');
		if (this.props.status !== 'IN_REVIEW') throw new Error('Only courses in review can be published');
		this.props.status = 'PUBLISHED';
		this.props.publishedAt = new Date();
	}

	delete(): void {
		if (!this.visa.determineIf((permissions) => permissions.canDeleteCourses)) throw new PermissionError('You do not have permission to delete courses');
		if (this.props.status === 'ARCHIVED') throw new Error('Archived courses cannot be deleted');
		this.requestDelete();
	}
}

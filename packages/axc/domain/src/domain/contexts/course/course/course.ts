import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { CourseVisa } from '../course.visa.ts';
import * as ValueObjects from './course.value-objects.ts';

export { COURSE_MODALITIES, COURSE_STATUSES } from './course.value-objects.ts';
export type { CourseModality, CourseStatus } from './course.value-objects.ts';
import type { CourseModality, CourseStatus } from './course.value-objects.ts';

/**
 * Persistence-agnostic properties of a Course aggregate. The mongoose domain
 * adapter implements this over a mongoose document. Mirrors `CommunityProps`.
 */
export interface CourseProps extends DomainEntityProps {
	title: string;
	summary: string;
	modality: CourseModality;
	status: CourseStatus;
	tags: string[];

	get createdAt(): Date;
	get updatedAt(): Date;
	get schemaVersion(): string;
}

/** Read-only view of a Course, handed to callers of the read model. */
export interface CourseEntityReference extends Readonly<CourseProps> {}

/**
 * The Course aggregate root. Mirrors the Community aggregate: setters validate
 * through value objects and are guarded by the caller's {@link CourseVisa}.
 */
export class Course<props extends CourseProps> extends AggregateRoot<props, Passport> implements CourseEntityReference {
	private isNew: boolean = false;
	private readonly visa: CourseVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.course.forCourse(this);
	}

	public static getNewInstance<props extends CourseProps>(newProps: props, title: string, summary: string, modality: CourseModality, passport: Passport): Course<props> {
		const newInstance = new Course(newProps, passport);
		newInstance.markAsNew();
		newInstance.title = title;
		newInstance.summary = summary;
		newInstance.modality = modality;
		newInstance.status = 'draft';
		newInstance.isNew = false;
		return newInstance;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

	private guardManage(action: string): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCourses)) {
			throw new PermissionError(`You do not have permission to ${action}`);
		}
	}

	get title(): string {
		return this.props.title;
	}
	set title(title: string) {
		this.guardManage('change the title of this course');
		this.props.title = new ValueObjects.Title(title).valueOf();
	}

	get summary(): string {
		return this.props.summary;
	}
	set summary(summary: string) {
		this.guardManage('change the summary of this course');
		this.props.summary = new ValueObjects.Summary(summary).valueOf();
	}

	get modality(): CourseModality {
		return this.props.modality;
	}
	set modality(modality: CourseModality) {
		this.guardManage('change the modality of this course');
		this.props.modality = new ValueObjects.Modality(modality).valueOf();
	}

	get status(): CourseStatus {
		return this.props.status;
	}
	set status(status: CourseStatus) {
		this.guardManage('change the status of this course');
		this.props.status = new ValueObjects.Status(status).valueOf();
	}

	get tags(): string[] {
		return this.props.tags;
	}
	set tags(tags: string[]) {
		this.guardManage('change the tags of this course');
		this.props.tags = new ValueObjects.Tags(tags).valueOf();
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}
	get schemaVersion(): string {
		return this.props.schemaVersion;
	}
}

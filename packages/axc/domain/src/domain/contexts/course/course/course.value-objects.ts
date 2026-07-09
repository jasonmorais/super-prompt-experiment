/**
 * Value objects for the Course aggregate.
 *
 * Mirrors the Community context's `community.value-objects.ts` (validation at
 * the boundary, `valueOf()` unwraps the primitive). Community uses
 * `@lucaspaganini/value-objects`; that dependency is not present in this repo,
 * so these are hand-rolled classes with the same usage contract
 * (`new ValueObjects.Title(value).valueOf()`).
 */

export const COURSE_MODALITIES = ['online', 'in-person', 'hybrid'] as const;
export const COURSE_STATUSES = ['draft', 'active', 'retired'] as const;

export type CourseModality = (typeof COURSE_MODALITIES)[number];
export type CourseStatus = (typeof COURSE_STATUSES)[number];

const trimmedString = (value: string, field: string, minLength: number, maxLength: number): string => {
	const trimmed = (value ?? '').trim();
	if (trimmed.length < minLength || trimmed.length > maxLength) {
		throw new Error(`${field} must be between ${minLength} and ${maxLength} characters`);
	}
	return trimmed;
};

export class Title {
	private readonly value: string;
	constructor(value: string) {
		this.value = trimmedString(value, 'Title', 1, 200);
	}
	valueOf(): string {
		return this.value;
	}
}

export class Summary {
	private readonly value: string;
	constructor(value: string) {
		this.value = trimmedString(value, 'Summary', 1, 2000);
	}
	valueOf(): string {
		return this.value;
	}
}

export class Modality {
	private readonly value: CourseModality;
	constructor(value: string) {
		if (!(COURSE_MODALITIES as readonly string[]).includes(value)) {
			throw new Error(`Modality must be one of: ${COURSE_MODALITIES.join(', ')}`);
		}
		this.value = value as CourseModality;
	}
	valueOf(): CourseModality {
		return this.value;
	}
}

export class Status {
	private readonly value: CourseStatus;
	constructor(value: string) {
		if (!(COURSE_STATUSES as readonly string[]).includes(value)) {
			throw new Error(`Status must be one of: ${COURSE_STATUSES.join(', ')}`);
		}
		this.value = value as CourseStatus;
	}
	valueOf(): CourseStatus {
		return this.value;
	}
}

export class Tags {
	private readonly value: string[];
	constructor(value: string[]) {
		if (!Array.isArray(value)) {
			throw new Error('Tags must be an array');
		}
		this.value = value.map((tag) => trimmedString(tag, 'Tag', 1, 50));
	}
	valueOf(): string[] {
		return this.value;
	}
}

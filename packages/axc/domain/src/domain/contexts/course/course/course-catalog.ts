import { COURSE_MODALITIES, COURSE_STATUSES, type CourseModality, type CourseStatus } from './course.value-objects.ts';

export const COURSE_SORT_FIELDS = ['title', 'createdAt', 'updatedAt'] as const;
export type CourseSortField = (typeof COURSE_SORT_FIELDS)[number];

export type CourseCatalogSearchItem = {
	id: string;
	title: string;
	summary: string;
	modality: CourseModality;
	status: CourseStatus;
	tags: string[];
	createdAt: string;
	updatedAt: string;
};

export type CourseCatalogQueryInput = {
	q?: string;
	modality?: string;
	status?: string;
	tag?: string;
	page?: string;
	pageSize?: string;
	sort?: string;
};

export type CourseCatalogQuery = {
	q?: string;
	modality?: CourseModality;
	status?: CourseStatus;
	tag?: string;
	page: number;
	pageSize: number;
	sort: CourseSortField;
};

export type CourseCatalogSearchResult = {
	items: CourseCatalogSearchItem[];
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
};

export type CourseCatalogValidationDetail = {
	field: string;
	message: string;
};

export type CourseCatalogValidationResult = {
	query: CourseCatalogQuery;
	errors: CourseCatalogValidationDetail[];
};

export function validateCourseCatalogQuery(input: CourseCatalogQueryInput): CourseCatalogValidationResult {
	const errors: CourseCatalogValidationDetail[] = [];
	const page = parseInteger(input.page, 'page', 1, errors, 1);
	const pageSize = parseInteger(input.pageSize, 'pageSize', 10, errors, 1, 50);
	const sort = normalizeSort(input.sort, errors);
	const modality = normalizeEnum(input.modality, COURSE_MODALITIES, 'modality', errors, 'online, in-person, or hybrid');
	const status = normalizeEnum(input.status, COURSE_STATUSES, 'status', errors, 'draft, active, or retired');
	const q = input.q?.trim();
	const tag = input.tag?.trim().toLowerCase();

	const query: CourseCatalogQuery = {
		page: page ?? 1,
		pageSize: pageSize ?? 10,
		sort: sort ?? 'title',
	};

	if (q) {
		query.q = q.toLowerCase();
	}
	if (modality) {
		query.modality = modality;
	}
	if (status) {
		query.status = status;
	}
	if (tag) {
		query.tag = tag;
	}

	return {
		query,
		errors,
	};
}

function parseInteger(value: string | undefined, field: string, fallback: number, errors: CourseCatalogValidationDetail[], minValue?: number, maxValue?: number): number | undefined {
	if (value === undefined || value === '') {
		return fallback;
	}

	const parsed = Number.parseInt(value, 10);
	if (!Number.isInteger(parsed)) {
		errors.push({ field, message: `${field} must be an integer.` });
		return undefined;
	}

	if (minValue !== undefined && parsed < minValue) {
		errors.push({ field, message: `${field} must be greater than or equal to ${minValue}.` });
		return undefined;
	}

	if (maxValue !== undefined && parsed > maxValue) {
		errors.push({ field, message: `${field} must be between ${minValue} and ${maxValue}.` });
		return undefined;
	}

	return parsed;
}

function normalizeSort(value: string | undefined, errors: CourseCatalogValidationDetail[]): CourseSortField | undefined {
	if (value === undefined || value === '') {
		return 'title';
	}

	const trimmed = value.trim();
	if (trimmed === 'title' || trimmed === 'createdAt' || trimmed === 'updatedAt') {
		return trimmed as CourseSortField;
	}

	errors.push({ field: 'sort', message: 'sort must be one of title, createdAt, or updatedAt.' });
	return undefined;
}

function normalizeEnum<T extends string>(value: string | undefined, allowedValues: readonly T[], field: string, errors: CourseCatalogValidationDetail[], humanReadable: string): T | undefined {
	if (value === undefined || value === '') {
		return undefined;
	}

	const normalized = value.trim().toLowerCase();
	const match = allowedValues.find((candidate) => candidate.toLowerCase() === normalized);
	if (!match) {
		errors.push({ field, message: `${field} must be one of ${humanReadable}.` });
		return undefined;
	}

	return match;
}

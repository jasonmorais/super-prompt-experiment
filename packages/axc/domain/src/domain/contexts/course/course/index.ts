export type { CourseRepository } from './course.repository.ts';
export { Course, type CourseEntityReference, type CourseModality, type CourseProps, type CourseStatus, COURSE_MODALITIES, COURSE_STATUSES } from './course.ts';
export type { CourseUnitOfWork } from './course.uow.ts';
export * as ValueObjects from './course.value-objects.ts';
export {
	type CourseCatalogQuery,
	type CourseCatalogQueryInput,
	type CourseCatalogSearchItem,
	type CourseCatalogSearchResult,
	type CourseCatalogValidationDetail,
	type CourseCatalogValidationResult,
	type CourseSortField,
	COURSE_SORT_FIELDS,
	validateCourseCatalogQuery,
} from './course-catalog.ts';

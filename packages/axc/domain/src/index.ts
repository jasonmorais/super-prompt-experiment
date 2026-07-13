import type { CourseUnitOfWork } from './domain/contexts/course/course/course.uow.ts';

export * as Domain from './domain/index.ts';
export type { Passport } from './domain/contexts/passport.ts';
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
} from './domain/contexts/course/course/course-catalog.ts';

/**
 * Aggregate of the domain's unit-of-work data sources. It is built by the
 * persistence layer and handed to event-handler registration at startup.
 *
 * Mirrors the Community layout (`Community: { Community: { CommunityUnitOfWork } }`):
 * one entry per bounded context, each exposing its aggregates' units of work.
 */
export interface DomainDataSource {
	Course: {
		Course: {
			CourseUnitOfWork: CourseUnitOfWork;
		};
	};
}

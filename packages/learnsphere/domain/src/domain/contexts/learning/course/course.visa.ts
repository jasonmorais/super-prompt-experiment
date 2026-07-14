import type { CourseDomainPermissions } from './course.domain-permissions.ts';

export interface CourseVisa {
	determineIf(predicate: (permissions: Readonly<CourseDomainPermissions>) => boolean): boolean;
}

import type { CourseDomainPermissions } from '../../../contexts/learning/course/course.domain-permissions.ts';
import type { CourseVisa } from '../../../contexts/learning/course/course.visa.ts';

/** A guest holds no course permissions. */
export class GuestCourseVisa implements CourseVisa {
	determineIf(predicate: (permissions: Readonly<CourseDomainPermissions>) => boolean): boolean {
		return predicate({ canCreateCourses: false, canManageLearningContent: false, canPublishCourses: false, canDeleteCourses: false });
	}
}

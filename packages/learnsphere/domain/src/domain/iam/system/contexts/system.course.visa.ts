import type { CourseDomainPermissions } from '../../../contexts/learning/course/course.domain-permissions.ts';
import type { CourseVisa } from '../../../contexts/learning/course/course.visa.ts';

/** The system account holds full course permissions everywhere. */
export class SystemCourseVisa implements CourseVisa {
	determineIf(predicate: (permissions: Readonly<CourseDomainPermissions>) => boolean): boolean {
		return predicate({ canCreateCourses: true, canManageLearningContent: true, canPublishCourses: true, canDeleteCourses: true });
	}
}

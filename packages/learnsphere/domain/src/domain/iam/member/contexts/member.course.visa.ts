import type { CourseDomainPermissions } from '../../../contexts/learning/course/course.domain-permissions.ts';
import type { CourseVisa } from '../../../contexts/learning/course/course.visa.ts';

/** A member (learner) never holds course-authoring permissions. */
export class MemberCourseVisa implements CourseVisa {
	determineIf(predicate: (permissions: Readonly<CourseDomainPermissions>) => boolean): boolean {
		return predicate({ canCreateCourses: false, canManageLearningContent: false, canPublishCourses: false, canDeleteCourses: false });
	}
}

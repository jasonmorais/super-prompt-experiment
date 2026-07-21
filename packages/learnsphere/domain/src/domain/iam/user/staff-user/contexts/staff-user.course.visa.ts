import type { CourseDomainPermissions } from '../../../../contexts/learning/course/course.domain-permissions.ts';
import type { CourseEntityReference } from '../../../../contexts/learning/course/course.ts';
import type { CourseVisa } from '../../../../contexts/learning/course/course.visa.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';

/** A staff user's course permissions are derived from their role's portal permissions, scoped to organizations they're assigned to. */
export class StaffUserCourseVisa implements CourseVisa {
	private readonly course: CourseEntityReference;
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly inScope: (organizationId: string) => boolean;

	constructor(course: CourseEntityReference, portal: StaffPortalPermissionsEntityReference | undefined, inScope: (organizationId: string) => boolean) {
		this.course = course;
		this.portal = portal;
		this.inScope = inScope;
	}

	determineIf(predicate: (permissions: Readonly<CourseDomainPermissions>) => boolean): boolean {
		if (!this.inScope(this.course.organizationId)) {
			return predicate({ canCreateCourses: false, canManageLearningContent: false, canPublishCourses: false, canDeleteCourses: false });
		}
		return predicate({
			canCreateCourses: this.portal?.canManageCourses ?? false,
			canManageLearningContent: this.portal?.canManageCourses ?? false,
			canPublishCourses: this.portal?.canPublishCourses ?? false,
			canDeleteCourses: this.portal?.canDeleteCourses ?? false,
		});
	}
}

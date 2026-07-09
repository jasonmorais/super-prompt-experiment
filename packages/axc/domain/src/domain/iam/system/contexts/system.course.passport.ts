import type { CourseDomainPermissions } from '../../../contexts/course/course.domain-permissions.ts';
import type { CoursePassport } from '../../../contexts/course/course.passport.ts';
import type { CourseVisa } from '../../../contexts/course/course.visa.ts';
import type { CourseEntityReference } from '../../../contexts/course/course/course.ts';
import { SystemPassportBase } from '../system.passport-base.ts';

export class SystemCoursePassport extends SystemPassportBase implements CoursePassport {
	forCourse(_root: CourseEntityReference): CourseVisa {
		const permissions = this.permissions as CourseDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}

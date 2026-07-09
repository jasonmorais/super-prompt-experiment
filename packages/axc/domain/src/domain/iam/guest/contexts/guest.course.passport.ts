import type { CoursePassport } from '../../../contexts/course/course.passport.ts';
import type { CourseVisa } from '../../../contexts/course/course.visa.ts';
import type { CourseEntityReference } from '../../../contexts/course/course/course.ts';
import { GuestPassportBase } from '../guest.passport-base.ts';

export class GuestCoursePassport extends GuestPassportBase implements CoursePassport {
	forCourse(_root: CourseEntityReference): CourseVisa {
		return { determineIf: () => false };
	}
}

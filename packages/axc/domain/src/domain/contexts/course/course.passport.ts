import type { CourseEntityReference } from './course/course.ts';
import type { CourseVisa } from './course.visa.ts';

/**
 * Issues a {@link CourseVisa} for a given Course aggregate. Mirrors
 * `community.passport.ts`.
 */
export interface CoursePassport {
	forCourse(root: CourseEntityReference): CourseVisa;
}

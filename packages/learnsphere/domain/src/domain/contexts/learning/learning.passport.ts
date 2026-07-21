import type { AssessmentEntityReference } from './assessment/assessment.ts';
import type { AssessmentVisa } from './assessment/assessment.visa.ts';
import type { CourseEntityReference } from './course/course.ts';
import type { CourseVisa } from './course/course.visa.ts';
export interface LearningPassport {
	forCourse(course: CourseEntityReference): CourseVisa;
	forAssessment(assessment: AssessmentEntityReference): AssessmentVisa;
}

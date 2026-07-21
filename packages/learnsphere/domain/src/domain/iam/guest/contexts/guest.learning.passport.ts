import type { AssessmentEntityReference } from '../../../contexts/learning/assessment/assessment.ts';
import type { AssessmentVisa } from '../../../contexts/learning/assessment/assessment.visa.ts';
import type { CourseEntityReference } from '../../../contexts/learning/course/course.ts';
import type { CourseVisa } from '../../../contexts/learning/course/course.visa.ts';
import type { LearningPassport } from '../../../contexts/learning/learning.passport.ts';
import { GuestAssessmentVisa } from './guest.assessment.visa.ts';
import { GuestCourseVisa } from './guest.course.visa.ts';

export class GuestLearningPassport implements LearningPassport {
	forCourse(_course: CourseEntityReference): CourseVisa {
		return new GuestCourseVisa();
	}
	forAssessment(_assessment: AssessmentEntityReference): AssessmentVisa {
		return new GuestAssessmentVisa();
	}
}

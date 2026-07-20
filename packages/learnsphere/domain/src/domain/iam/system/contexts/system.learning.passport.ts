import type { AssessmentEntityReference } from '../../../contexts/learning/assessment/assessment.ts';
import type { AssessmentVisa } from '../../../contexts/learning/assessment/assessment.visa.ts';
import type { CourseEntityReference } from '../../../contexts/learning/course/course.ts';
import type { CourseVisa } from '../../../contexts/learning/course/course.visa.ts';
import type { LearningPassport } from '../../../contexts/learning/learning.passport.ts';
import { SystemAssessmentVisa } from './system.assessment.visa.ts';
import { SystemCourseVisa } from './system.course.visa.ts';

export class SystemLearningPassport implements LearningPassport {
	forCourse(_course: CourseEntityReference): CourseVisa {
		return new SystemCourseVisa();
	}
	forAssessment(_assessment: AssessmentEntityReference): AssessmentVisa {
		return new SystemAssessmentVisa();
	}
}

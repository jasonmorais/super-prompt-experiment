import type { AssessmentEntityReference } from '../../../contexts/learning/assessment/assessment.ts';
import type { AssessmentVisa } from '../../../contexts/learning/assessment/assessment.visa.ts';
import type { CourseEntityReference } from '../../../contexts/learning/course/course.ts';
import type { CourseVisa } from '../../../contexts/learning/course/course.visa.ts';
import type { LearningPassport } from '../../../contexts/learning/learning.passport.ts';
import { MemberAssessmentVisa } from './member.assessment.visa.ts';
import { MemberCourseVisa } from './member.course.visa.ts';

export class MemberLearningPassport implements LearningPassport {
	private readonly organizationId: string | undefined;

	constructor(organizationId: string | undefined) {
		this.organizationId = organizationId;
	}

	forCourse(_course: CourseEntityReference): CourseVisa {
		return new MemberCourseVisa();
	}
	forAssessment(assessment: AssessmentEntityReference): AssessmentVisa {
		return new MemberAssessmentVisa(assessment, this.organizationId);
	}
}

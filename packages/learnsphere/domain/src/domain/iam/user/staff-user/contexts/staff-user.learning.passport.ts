import type { AssessmentEntityReference } from '../../../../contexts/learning/assessment/assessment.ts';
import type { AssessmentVisa } from '../../../../contexts/learning/assessment/assessment.visa.ts';
import type { CourseEntityReference } from '../../../../contexts/learning/course/course.ts';
import type { CourseVisa } from '../../../../contexts/learning/course/course.visa.ts';
import type { LearningPassport } from '../../../../contexts/learning/learning.passport.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';
import { StaffUserAssessmentVisa } from './staff-user.assessment.visa.ts';
import { StaffUserCourseVisa } from './staff-user.course.visa.ts';

export class StaffUserLearningPassport implements LearningPassport {
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly inScope: (organizationId: string) => boolean;

	constructor(portal: StaffPortalPermissionsEntityReference | undefined, inScope: (organizationId: string) => boolean) {
		this.portal = portal;
		this.inScope = inScope;
	}

	forCourse(course: CourseEntityReference): CourseVisa {
		return new StaffUserCourseVisa(course, this.portal, this.inScope);
	}
	forAssessment(assessment: AssessmentEntityReference): AssessmentVisa {
		return new StaffUserAssessmentVisa(assessment, this.portal, this.inScope);
	}
}

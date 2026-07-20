import type { Passport } from '../../passport-factory.ts';
import { GuestAssessmentVisa } from './contexts/guest.assessment.visa.ts';
import { GuestCourseVisa } from './contexts/guest.course.visa.ts';
import { GuestLearningRecordVisa } from './contexts/guest.learning-record.visa.ts';
import { GuestOrganizationVisa } from './contexts/guest.organization.visa.ts';
import { GuestTeamOperationVisa } from './contexts/guest.team-operation.visa.ts';
import { GuestUserVisa } from './contexts/guest.user.visa.ts';

/** An unauthenticated actor. Holds no permissions anywhere in the system. */
export const GuestPassport = {
	create(): Passport {
		return {
			isGuest: true,
			canViewTeamLearning: false,
			canManageTeams: false,
			canAccessOrganization: () => false,
			user: {
				forLearnerUser: () => new GuestUserVisa(),
				forStaffUser: () => new GuestUserVisa(),
				forStaffRole: () => new GuestUserVisa(),
			},
			learning: {
				forCourse: () => new GuestCourseVisa(),
				forAssessment: () => new GuestAssessmentVisa(),
			},
			organization: {
				forOrganization: () => new GuestOrganizationVisa(),
			},
			delivery: {
				forLearningRecord: () => new GuestLearningRecordVisa(),
			},
			operations: {
				forTeamOperation: () => new GuestTeamOperationVisa(),
			},
		};
	},
};

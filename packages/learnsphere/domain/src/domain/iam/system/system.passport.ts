import type { Passport } from '../../passport-factory.ts';
import { SystemAssessmentVisa } from './contexts/system.assessment.visa.ts';
import { SystemCourseVisa } from './contexts/system.course.visa.ts';
import { SystemLearningRecordVisa } from './contexts/system.learning-record.visa.ts';
import { SystemOrganizationVisa } from './contexts/system.organization.visa.ts';
import { SystemTeamOperationVisa } from './contexts/system.team-operation.visa.ts';
import { SystemUserVisa } from './contexts/system.user.visa.ts';

/** The trusted system actor used by background/integration workflows. Holds full permissions everywhere. */
export const SystemPassport = {
	create(): Passport {
		return {
			isGuest: false,
			canViewTeamLearning: true,
			canManageTeams: true,
			canAccessOrganization: (organizationId) => Boolean(organizationId),
			user: {
				forLearnerUser: () => new SystemUserVisa(),
				forStaffUser: () => new SystemUserVisa(),
				forStaffRole: () => new SystemUserVisa(),
			},
			learning: {
				forCourse: () => new SystemCourseVisa(),
				forAssessment: () => new SystemAssessmentVisa(),
			},
			organization: {
				forOrganization: () => new SystemOrganizationVisa(),
			},
			delivery: {
				forLearningRecord: () => new SystemLearningRecordVisa(),
			},
			operations: {
				forTeamOperation: () => new SystemTeamOperationVisa(),
			},
		};
	},
};

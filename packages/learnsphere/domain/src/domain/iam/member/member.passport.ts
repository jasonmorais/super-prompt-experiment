import type { LearnerUserEntityReference } from '../../contexts/user/learner-user/learner-user.ts';
import type { Passport } from '../../passport-factory.ts';
import { MemberAssessmentVisa } from './contexts/member.assessment.visa.ts';
import { MemberCourseVisa } from './contexts/member.course.visa.ts';
import { MemberLearningRecordVisa } from './contexts/member.learning-record.visa.ts';
import { MemberOrganizationVisa } from './contexts/member.organization.visa.ts';
import { MemberTeamOperationVisa } from './contexts/member.team-operation.visa.ts';
import { MemberUserVisa } from './contexts/member.user.visa.ts';

const build = (learnerId: string, organizationId: string | undefined, actorExternalId: string | undefined): Passport => {
	const isOwnAccount = (rootExternalId: string): boolean => Boolean(actorExternalId && rootExternalId === actorExternalId);
	return {
		isGuest: false,
		canViewTeamLearning: false,
		canManageTeams: false,
		canAccessOrganization: (candidateOrganizationId) => Boolean(candidateOrganizationId && organizationId === candidateOrganizationId),
		user: {
			forLearnerUser: (root) => new MemberUserVisa(isOwnAccount(root.externalId)),
			forStaffUser: (root) => new MemberUserVisa(isOwnAccount(root.externalId)),
			// A member's own-account status never carries over to staff-role visas.
			forStaffRole: () => new MemberUserVisa(actorExternalId !== undefined),
		},
		learning: {
			forCourse: () => new MemberCourseVisa(),
			forAssessment: (assessment) => new MemberAssessmentVisa(assessment, organizationId),
		},
		organization: {
			forOrganization: () => new MemberOrganizationVisa(),
		},
		delivery: {
			forLearningRecord: (record) => new MemberLearningRecordVisa(record, learnerId),
		},
		operations: {
			forTeamOperation: (operation) => new MemberTeamOperationVisa(operation, learnerId),
		},
	};
};

/**
 * A member (learner) actor, either resolved from a raw external id before a
 * LearnerUser aggregate has been loaded ({@link MemberPassport.forLearner}),
 * or from the fully loaded aggregate ({@link MemberPassport.forLearnerUser}).
 */
export const MemberPassport = {
	forLearner(learnerId: string, organizationId?: string): Passport {
		return build(learnerId, organizationId, undefined);
	},

	forLearnerUser(learnerUser: LearnerUserEntityReference, organizationId?: string): Passport {
		return build(learnerUser.externalId, organizationId, learnerUser.externalId);
	},
};

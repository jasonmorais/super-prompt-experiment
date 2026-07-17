import type { CourseEntityReference } from './contexts/learning/course/course.ts';
import type { CourseDomainPermissions } from './contexts/learning/course/course.domain-permissions.ts';
import type { CourseVisa } from './contexts/learning/course/course.visa.ts';
import type { AssessmentEntityReference } from './contexts/learning/assessment/assessment.ts';
import type { AssessmentDomainPermissions } from './contexts/learning/assessment/assessment.domain-permissions.ts';
import type { AssessmentVisa } from './contexts/learning/assessment/assessment.visa.ts';
import type { LearningRecordEntityReference } from './contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordDomainPermissions } from './contexts/delivery/learning-record/learning-record.domain-permissions.ts';
import type { LearningRecordVisa } from './contexts/delivery/learning-record/learning-record.visa.ts';
import type { TeamOperationEntityReference } from './contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationDomainPermissions } from './contexts/operations/team-operation/team-operation.domain-permissions.ts';
import type { TeamOperationVisa } from './contexts/operations/team-operation/team-operation.visa.ts';
import type { OrganizationEntityReference } from './contexts/organization/organization.ts';
import type { OrganizationDomainPermissions } from './contexts/organization/organization.domain-permissions.ts';
import type { OrganizationPassport } from './contexts/organization/organization.passport.ts';
import type { OrganizationVisa } from './contexts/organization/organization.visa.ts';
import type { LearnerUserEntityReference } from './contexts/user/learner-user/learner-user.ts';
import type { StaffUserEntityReference } from './contexts/user/staff-user/staff-user.ts';
import type { UserDomainPermissions } from './contexts/user/user.domain-permissions.ts';
import type { UserPassport } from './contexts/user/user.passport.ts';
import type { UserVisa } from './contexts/user/user.visa.ts';

export type LearningDeliveryPermissions = LearningRecordDomainPermissions;
export type LearningContentVisa = CourseVisa;

export interface Passport {
	readonly isGuest: boolean;
	readonly canViewTeamLearning: boolean;
	readonly canManageTeams: boolean;
	canAccessOrganization(organizationId: string): boolean;
	readonly user: UserPassport;
	readonly learning: {
		forCourse(course: CourseEntityReference): CourseVisa;
		forAssessment(assessment: AssessmentEntityReference): AssessmentVisa;
	};
	readonly organization: OrganizationPassport;
	readonly delivery: {
		forLearningRecord(record: LearningRecordEntityReference): LearningRecordVisa;
	};
	readonly operations: {
		forTeamOperation(operation: TeamOperationEntityReference): TeamOperationVisa;
	};
}

type ScopedPermissions<T, Root> = T | ((root: Root) => T);
interface PassportOptions {
	actorExternalId?: string;
	accessibleOrganizationIds?: readonly string[];
	canViewTeamLearning?: boolean;
	assessmentPermissions?: ScopedPermissions<AssessmentDomainPermissions, AssessmentEntityReference>;
	organizationPermissions?: ScopedPermissions<OrganizationDomainPermissions, OrganizationEntityReference>;
}
const noAssessmentPermissions: AssessmentDomainPermissions = { canManageAssessments: false, canTakeAssessments: false, isSystemAccount: false };
const noOrganizationPermissions: OrganizationDomainPermissions = { canViewOrganization: false, canManageOrganizationStructure: false, isSystemAccount: false };

const buildPassport = (isGuest: boolean, canManageTeams: boolean, permissions: ScopedPermissions<CourseDomainPermissions, CourseEntityReference>, deliveryPermissions: ScopedPermissions<LearningDeliveryPermissions, LearningRecordEntityReference>, operationPermissions: ScopedPermissions<TeamOperationDomainPermissions, TeamOperationEntityReference>, userPermissions: UserDomainPermissions, options: PassportOptions = {}): Passport => ({
	isGuest,
	canManageTeams,
	canViewTeamLearning: options.canViewTeamLearning ?? (typeof deliveryPermissions === 'function' ? false : deliveryPermissions.canViewTeamLearning),
	canAccessOrganization: (organizationId) => Boolean(organizationId && (options.accessibleOrganizationIds?.includes('*') || options.accessibleOrganizationIds?.includes(organizationId))),
	user: {
		forLearnerUser: (root): UserVisa => ({ determineIf: (predicate) => predicate({ ...userPermissions, isEditingOwnAccount: Boolean(options.actorExternalId && root.externalId === options.actorExternalId) }) }),
		forStaffUser: (root): UserVisa => ({ determineIf: (predicate) => predicate({ ...userPermissions, isEditingOwnAccount: Boolean(options.actorExternalId && root.externalId === options.actorExternalId) }) }),
		forStaffRole: (_root): UserVisa => ({ determineIf: (predicate) => predicate(userPermissions) }),
	},
	learning: {
		forCourse: (course) => ({ determineIf: (predicate) => predicate(typeof permissions === 'function' ? permissions(course) : permissions) }),
		forAssessment: (assessment) => ({ determineIf: (predicate) => predicate(typeof options.assessmentPermissions === 'function' ? options.assessmentPermissions(assessment) : (options.assessmentPermissions ?? noAssessmentPermissions)) }),
	},
	organization: { forOrganization: (organization): OrganizationVisa => ({ determineIf: (predicate) => predicate(typeof options.organizationPermissions === 'function' ? options.organizationPermissions(organization) : (options.organizationPermissions ?? noOrganizationPermissions)) }) },
	delivery: {
		forLearningRecord: (record) => ({ determineIf: (predicate) => predicate(typeof deliveryPermissions === 'function' ? deliveryPermissions(record) : deliveryPermissions) }),
	},
	operations: {
		forTeamOperation: (operation) => ({ determineIf: (predicate) => predicate(typeof operationPermissions === 'function' ? operationPermissions(operation) : operationPermissions) }),
	},
});

const noContentPermissions: CourseDomainPermissions = {
	canCreateCourses: false,
	canManageLearningContent: false,
	canPublishCourses: false,
	canDeleteCourses: false,
};

const systemContentPermissions: CourseDomainPermissions = {
	canCreateCourses: true,
	canManageLearningContent: true,
	canPublishCourses: true,
	canDeleteCourses: true,
};

const systemDeliveryPermissions: LearningDeliveryPermissions = {
	canSelfEnroll: true,
	canAssignLearning: true,
	canViewTeamLearning: true,
	canRecordProgress: true,
	canWaiveAssignments: true,
};

export const PassportFactory = {
	forGuest: (): Passport => buildPassport(true, false, noContentPermissions, { canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false }, { canManageTeamOperations: false, canUpdateAssignedOperations: false, canEditTeamOperations: false, canDiscussTeamOperations: false, canConfirmTeamOperations: false }, { canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: false, isSystemAccount: false }),
	forLearner: (learnerId: string, organizationId?: string): Passport =>
		buildPassport(false, false, noContentPermissions, (record) => ({ canSelfEnroll: true, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: record.learnerId === learnerId, canWaiveAssignments: false }), (operation) => ({ canManageTeamOperations: false, canUpdateAssignedOperations: operation.assigneeId === learnerId, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: false }), { canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: false, isSystemAccount: false }, { accessibleOrganizationIds: organizationId ? [organizationId] : [], assessmentPermissions: (assessment) => ({ canManageAssessments: false, canTakeAssessments: assessment.organizationId === organizationId, isSystemAccount: false }) }),
	forInstructor: (): Passport =>
		buildPassport(
			false,
			false,
			{ ...noContentPermissions, canCreateCourses: true, canManageLearningContent: true },
			{ canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false },
			{ canManageTeamOperations: false, canUpdateAssignedOperations: false, canEditTeamOperations: false, canDiscussTeamOperations: false, canConfirmTeamOperations: false },
			{ canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: false, isSystemAccount: false },
			{ accessibleOrganizationIds: ['*'], assessmentPermissions: { canManageAssessments: true, canTakeAssessments: false, isSystemAccount: false }, organizationPermissions: { canViewOrganization: true, canManageOrganizationStructure: false, isSystemAccount: false } },
		),
	forLearnerUser: (learnerUser: LearnerUserEntityReference, organizationId?: string): Passport => buildPassport(false, false, noContentPermissions, (record) => ({ canSelfEnroll: true, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: record.learnerId === learnerUser.externalId, canWaiveAssignments: false }), (operation) => ({ canManageTeamOperations: false, canUpdateAssignedOperations: operation.assigneeId === learnerUser.externalId, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: false }), { canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: true, isSystemAccount: false }, { actorExternalId: learnerUser.externalId, accessibleOrganizationIds: organizationId ? [organizationId] : [], assessmentPermissions: (assessment) => ({ canManageAssessments: false, canTakeAssessments: assessment.organizationId === organizationId, isSystemAccount: false }) }),
	forStaffUser: (staffUser: StaffUserEntityReference, accessibleOrganizationIds: readonly string[] = staffUser.organizationScopes.map((scope) => scope.organizationId)): Passport => {
		const role = staffUser.role;
		const portal = role?.permissions.staffPortalPermissions;
		const staffPermissions = role?.permissions.userPermissions;
		const canManageTeams = role?.enterpriseAppRole === 'Staff.Manager' && (portal?.canManageTeams ?? false);
		const canManageStaffRolesAndPermissions = (role?.permissions.userPermissions.canAssignStaffRoles ?? false) || (role?.permissions.staffRolePermissions.canEditRole ?? false);
		const inScope = (organizationId: string) => accessibleOrganizationIds.includes(organizationId);
		const contentPermissions = (organizationId: string): CourseDomainPermissions => inScope(organizationId) ? { canCreateCourses: portal?.canManageCourses ?? false, canManageLearningContent: portal?.canManageCourses ?? false, canPublishCourses: portal?.canPublishCourses ?? false, canDeleteCourses: portal?.canDeleteCourses ?? false } : noContentPermissions;
		return buildPassport(
			false,
			canManageTeams,
			(course) => contentPermissions(course.organizationId),
			(record) => inScope(record.organizationId) ? { canSelfEnroll: false, canAssignLearning: portal?.canViewTeamLearning ?? false, canViewTeamLearning: portal?.canViewTeamLearning ?? false, canRecordProgress: false, canWaiveAssignments: portal?.canManageTeamOperations ?? false } : { canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false },
			(operation) => inScope(operation.organizationId) ? { canManageTeamOperations: portal?.canManageTeamOperations ?? false, canUpdateAssignedOperations: portal?.canManageTeamOperations ?? false, canEditTeamOperations: portal?.canManageTeamOperations ?? false, canDiscussTeamOperations: portal?.canManageTeamOperations ?? false, canConfirmTeamOperations: portal?.canConfirmTeamOperations ?? false } : { canManageTeamOperations: false, canUpdateAssignedOperations: false, canEditTeamOperations: false, canDiscussTeamOperations: false, canConfirmTeamOperations: false },
			{ canManageLearnerUsers: false, canManageStaffRolesAndPermissions, canManageStaffUsers: staffPermissions?.canManageUsers ?? false, isEditingOwnAccount: false, isSystemAccount: false },
			{ actorExternalId: staffUser.externalId, accessibleOrganizationIds, canViewTeamLearning: portal?.canViewTeamLearning ?? false, assessmentPermissions: (assessment) => ({ canManageAssessments: inScope(assessment.organizationId) && (portal?.canManageAssessments ?? false), canTakeAssessments: false, isSystemAccount: false }), organizationPermissions: (organization) => ({ canViewOrganization: inScope(organization.externalId) && (portal?.canViewOrganization ?? false), canManageOrganizationStructure: inScope(organization.externalId) && (portal?.canManageOrganizationStructure ?? false), isSystemAccount: false }) },
		);
	},
	forSystem: (): Passport => buildPassport(false, true, systemContentPermissions, systemDeliveryPermissions, { canManageTeamOperations: true, canUpdateAssignedOperations: true, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: true }, { canManageLearnerUsers: true, canManageStaffRolesAndPermissions: true, canManageStaffUsers: true, isEditingOwnAccount: false, isSystemAccount: true }, { accessibleOrganizationIds: ['*'], canViewTeamLearning: true, assessmentPermissions: { canManageAssessments: true, canTakeAssessments: true, isSystemAccount: true }, organizationPermissions: { canViewOrganization: true, canManageOrganizationStructure: true, isSystemAccount: true } }),
} as const;

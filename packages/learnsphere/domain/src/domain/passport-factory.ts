import type { CourseEntityReference } from './contexts/learning/course/course.ts';
import type { CourseDomainPermissions } from './contexts/learning/course/course.domain-permissions.ts';
import type { CourseVisa } from './contexts/learning/course/course.visa.ts';
import type { LearningRecordEntityReference } from './contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordDomainPermissions } from './contexts/delivery/learning-record/learning-record.domain-permissions.ts';
import type { LearningRecordVisa } from './contexts/delivery/learning-record/learning-record.visa.ts';
import type { TeamOperationEntityReference } from './contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationDomainPermissions } from './contexts/operations/team-operation/team-operation.domain-permissions.ts';
import type { TeamOperationVisa } from './contexts/operations/team-operation/team-operation.visa.ts';
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
	readonly user: UserPassport;
	readonly learning: {
		forCourse(course: CourseEntityReference): CourseVisa;
	};
	readonly delivery: {
		forLearningRecord(record: LearningRecordEntityReference): LearningRecordVisa;
	};
	readonly operations: {
		forTeamOperation(operation: TeamOperationEntityReference): TeamOperationVisa;
	};
}

const buildPassport = (isGuest: boolean, canManageTeams: boolean, permissions: CourseDomainPermissions, deliveryPermissions: LearningDeliveryPermissions | ((record: LearningRecordEntityReference) => LearningDeliveryPermissions), operationPermissions: TeamOperationDomainPermissions | ((operation: TeamOperationEntityReference) => TeamOperationDomainPermissions), userPermissions: UserDomainPermissions, actorExternalId?: string): Passport => ({
	isGuest,
	canManageTeams,
	canViewTeamLearning: typeof deliveryPermissions === 'function' ? false : deliveryPermissions.canViewTeamLearning,
	user: {
		forLearnerUser: (root): UserVisa => ({ determineIf: (predicate) => predicate({ ...userPermissions, isEditingOwnAccount: Boolean(actorExternalId && root.externalId === actorExternalId) }) }),
		forStaffUser: (root): UserVisa => ({ determineIf: (predicate) => predicate({ ...userPermissions, isEditingOwnAccount: Boolean(actorExternalId && root.externalId === actorExternalId) }) }),
		forStaffRole: (_root): UserVisa => ({ determineIf: (predicate) => predicate(userPermissions) }),
	},
	learning: {
		forCourse: (_course) => ({ determineIf: (predicate) => predicate(permissions) }),
	},
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
	forLearner: (learnerId: string): Passport =>
		buildPassport(false, false, noContentPermissions, (record) => ({ canSelfEnroll: true, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: record.learnerId === learnerId, canWaiveAssignments: false }), (operation) => ({ canManageTeamOperations: false, canUpdateAssignedOperations: operation.assigneeId === learnerId, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: false }), { canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: false, isSystemAccount: false }),
	forInstructor: (): Passport =>
		buildPassport(
			false,
			false,
			{ ...noContentPermissions, canCreateCourses: true, canManageLearningContent: true },
			{ canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false },
			{ canManageTeamOperations: false, canUpdateAssignedOperations: false, canEditTeamOperations: false, canDiscussTeamOperations: false, canConfirmTeamOperations: false },
			{ canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: false, isSystemAccount: false },
		),
	forLearnerUser: (learnerUser: LearnerUserEntityReference): Passport => buildPassport(false, false, noContentPermissions, (record) => ({ canSelfEnroll: true, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: record.learnerId === learnerUser.externalId, canWaiveAssignments: false }), (operation) => ({ canManageTeamOperations: false, canUpdateAssignedOperations: operation.assigneeId === learnerUser.externalId, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: false }), { canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: true, isSystemAccount: false }, learnerUser.externalId),
	forStaffUser: (staffUser: StaffUserEntityReference): Passport => {
		const role = staffUser.role;
		const portal = role?.permissions.staffPortalPermissions;
		const staffPermissions = role?.permissions.userPermissions;
		const canManageTeams = role?.enterpriseAppRole === 'Staff.Manager' && (portal?.canManageTeams ?? false);
		const canManageStaffRolesAndPermissions = (role?.permissions.userPermissions.canAssignStaffRoles ?? false) || (role?.permissions.staffRolePermissions.canEditRole ?? false);
		return buildPassport(
			false,
			canManageTeams,
			{ canCreateCourses: portal?.canManageCourses ?? false, canManageLearningContent: portal?.canManageCourses ?? false, canPublishCourses: portal?.canPublishCourses ?? false, canDeleteCourses: portal?.canDeleteCourses ?? false },
			{ canSelfEnroll: false, canAssignLearning: portal?.canViewTeamLearning ?? false, canViewTeamLearning: portal?.canViewTeamLearning ?? false, canRecordProgress: false, canWaiveAssignments: portal?.canManageTeamOperations ?? false },
			{ canManageTeamOperations: portal?.canManageTeamOperations ?? false, canUpdateAssignedOperations: portal?.canManageTeamOperations ?? false, canEditTeamOperations: portal?.canManageTeamOperations ?? false, canDiscussTeamOperations: portal?.canManageTeamOperations ?? false, canConfirmTeamOperations: portal?.canConfirmTeamOperations ?? false },
			{ canManageLearnerUsers: false, canManageStaffRolesAndPermissions, canManageStaffUsers: staffPermissions?.canManageUsers ?? false, isEditingOwnAccount: false, isSystemAccount: false },
			staffUser.externalId,
		);
	},
	forSystem: (): Passport => buildPassport(false, true, systemContentPermissions, systemDeliveryPermissions, { canManageTeamOperations: true, canUpdateAssignedOperations: true, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: true }, { canManageLearnerUsers: true, canManageStaffRolesAndPermissions: true, canManageStaffUsers: true, isEditingOwnAccount: false, isSystemAccount: true }),
} as const;

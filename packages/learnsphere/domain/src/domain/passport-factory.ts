import type { CourseEntityReference } from './contexts/learning/course/course.ts';
import type { CourseDomainPermissions } from './contexts/learning/course/course.domain-permissions.ts';
import type { CourseVisa } from './contexts/learning/course/course.visa.ts';
import type { LearningRecordEntityReference } from './contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordDomainPermissions } from './contexts/delivery/learning-record/learning-record.domain-permissions.ts';
import type { LearningRecordVisa } from './contexts/delivery/learning-record/learning-record.visa.ts';
import type { TeamOperationEntityReference } from './contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationDomainPermissions } from './contexts/operations/team-operation/team-operation.domain-permissions.ts';
import type { TeamOperationVisa } from './contexts/operations/team-operation/team-operation.visa.ts';

export type LearningDeliveryPermissions = LearningRecordDomainPermissions;
export type LearningContentVisa = CourseVisa;

export interface Passport {
	readonly isGuest: boolean;
	readonly canViewTeamLearning: boolean;
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

const buildPassport = (isGuest: boolean, permissions: CourseDomainPermissions, deliveryPermissions: LearningDeliveryPermissions | ((record: LearningRecordEntityReference) => LearningDeliveryPermissions), operationPermissions: TeamOperationDomainPermissions | ((operation: TeamOperationEntityReference) => TeamOperationDomainPermissions)): Passport => ({
	isGuest,
	canViewTeamLearning: typeof deliveryPermissions === 'function' ? false : deliveryPermissions.canViewTeamLearning,
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
	forGuest: (): Passport => buildPassport(true, noContentPermissions, { canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false }, { canManageTeamOperations: false, canUpdateAssignedOperations: false, canEditTeamOperations: false, canDiscussTeamOperations: false, canConfirmTeamOperations: false }),
	forLearner: (learnerId: string): Passport =>
		buildPassport(false, noContentPermissions, (record) => ({ canSelfEnroll: true, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: record.learnerId === learnerId, canWaiveAssignments: false }), (operation) => ({ canManageTeamOperations: false, canUpdateAssignedOperations: operation.assigneeId === learnerId, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: false })),
	forInstructor: (): Passport =>
		buildPassport(
			false,
			{ ...noContentPermissions, canCreateCourses: true, canManageLearningContent: true },
			{ canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false },
			{ canManageTeamOperations: false, canUpdateAssignedOperations: false, canEditTeamOperations: false, canDiscussTeamOperations: false, canConfirmTeamOperations: false },
		),
	forManager: (): Passport => buildPassport(false, noContentPermissions, { canSelfEnroll: false, canAssignLearning: true, canViewTeamLearning: true, canRecordProgress: false, canWaiveAssignments: true }, { canManageTeamOperations: true, canUpdateAssignedOperations: true, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: true }),
	forLearningAdmin: (): Passport => buildPassport(false, systemContentPermissions, systemDeliveryPermissions, { canManageTeamOperations: true, canUpdateAssignedOperations: false, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: false }),
	forManagerLearningAdmin: (): Passport => buildPassport(false, systemContentPermissions, systemDeliveryPermissions, { canManageTeamOperations: true, canUpdateAssignedOperations: true, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: true }),
	forSystem: (): Passport => buildPassport(false, systemContentPermissions, systemDeliveryPermissions, { canManageTeamOperations: true, canUpdateAssignedOperations: true, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: true }),
} as const;

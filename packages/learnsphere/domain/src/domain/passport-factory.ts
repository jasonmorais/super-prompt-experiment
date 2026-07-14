import type { CourseEntityReference } from './contexts/learning/course/course.ts';
import type { CourseDomainPermissions } from './contexts/learning/course/course.domain-permissions.ts';
import type { CourseVisa } from './contexts/learning/course/course.visa.ts';
import type { LearningRecordEntityReference } from './contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordDomainPermissions } from './contexts/delivery/learning-record/learning-record.domain-permissions.ts';
import type { LearningRecordVisa } from './contexts/delivery/learning-record/learning-record.visa.ts';

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
}

const buildPassport = (isGuest: boolean, permissions: CourseDomainPermissions, deliveryPermissions: LearningDeliveryPermissions | ((record: LearningRecordEntityReference) => LearningDeliveryPermissions)): Passport => ({
	isGuest,
	canViewTeamLearning: typeof deliveryPermissions === 'function' ? false : deliveryPermissions.canViewTeamLearning,
	learning: {
		forCourse: (_course) => ({ determineIf: (predicate) => predicate(permissions) }),
	},
	delivery: {
		forLearningRecord: (record) => ({ determineIf: (predicate) => predicate(typeof deliveryPermissions === 'function' ? deliveryPermissions(record) : deliveryPermissions) }),
	},
});

const noContentPermissions: CourseDomainPermissions = {
	canCreateCourses: false,
	canManageLearningContent: false,
	canPublishCourses: false,
	canDeleteCourses: false,
};

export const PassportFactory = {
	forGuest: (): Passport => buildPassport(true, noContentPermissions, { canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false }),
	forLearner: (learnerId: string): Passport =>
		buildPassport(false, noContentPermissions, (record) => ({ canSelfEnroll: true, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: record.learnerId === learnerId, canWaiveAssignments: false })),
	forInstructor: (): Passport =>
		buildPassport(
			false,
			{ ...noContentPermissions, canCreateCourses: true, canManageLearningContent: true },
			{ canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false },
		),
	forManager: (): Passport => buildPassport(false, noContentPermissions, { canSelfEnroll: false, canAssignLearning: true, canViewTeamLearning: true, canRecordProgress: false, canWaiveAssignments: true }),
	forSystem: (): Passport =>
		buildPassport(
			false,
			{ canCreateCourses: true, canManageLearningContent: true, canPublishCourses: true, canDeleteCourses: true },
			{ canSelfEnroll: true, canAssignLearning: true, canViewTeamLearning: true, canRecordProgress: true, canWaiveAssignments: true },
		),
} as const;

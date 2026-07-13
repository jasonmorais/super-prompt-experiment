import type { CourseEntityReference } from './contexts/learning/course/course.ts';
import type { LearningContentPermissions } from './contexts/learning/learning-content.permissions.ts';
import type { LearningRecordEntityReference } from './contexts/delivery/learning-record/learning-record.ts';

export interface LearningDeliveryPermissions {
	canAssignLearning: boolean;
	canRecordProgress: boolean;
	canWaiveAssignments: boolean;
}

export interface LearningContentVisa {
	determineIf(predicate: (permissions: Readonly<LearningContentPermissions>) => boolean): boolean;
}

export interface Passport {
	readonly isGuest: boolean;
	readonly learning: {
		forCourse(course: CourseEntityReference): LearningContentVisa;
	};
	readonly delivery: {
		forLearningRecord(record: LearningRecordEntityReference): { determineIf(predicate: (permissions: Readonly<LearningDeliveryPermissions>) => boolean): boolean };
	};
}

const buildPassport = (isGuest: boolean, permissions: LearningContentPermissions, deliveryPermissions: LearningDeliveryPermissions | ((record: LearningRecordEntityReference) => LearningDeliveryPermissions)): Passport => ({
	isGuest,
	learning: {
		forCourse: (_course) => ({ determineIf: (predicate) => predicate(permissions) }),
	},
	delivery: {
		forLearningRecord: (record) => ({ determineIf: (predicate) => predicate(typeof deliveryPermissions === 'function' ? deliveryPermissions(record) : deliveryPermissions) }),
	},
});

const noPermissions: LearningContentPermissions = {
	canCreateCourses: false,
	canManageLearningContent: false,
	canPublishCourses: false,
};

export const PassportFactory = {
	forGuest: (): Passport => buildPassport(true, noPermissions, { canAssignLearning: false, canRecordProgress: false, canWaiveAssignments: false }),
	forLearner: (learnerId: string): Passport => buildPassport(false, noPermissions, (record) => ({ canAssignLearning: false, canRecordProgress: record.learnerId === learnerId, canWaiveAssignments: false })),
	forInstructor: (): Passport => buildPassport(false, { ...noPermissions, canCreateCourses: true, canManageLearningContent: true }, { canAssignLearning: false, canRecordProgress: false, canWaiveAssignments: false }),
	forSystem: (): Passport => buildPassport(false, { canCreateCourses: true, canManageLearningContent: true, canPublishCourses: true }, { canAssignLearning: true, canRecordProgress: true, canWaiveAssignments: true }),
} as const;

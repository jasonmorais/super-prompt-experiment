import type { LearningRecordDomainPermissions } from './contexts/delivery/learning-record/learning-record.domain-permissions.ts';
import type { LearningRecordEntityReference } from './contexts/delivery/learning-record/learning-record.ts';
import type { LearningRecordVisa } from './contexts/delivery/learning-record/learning-record.visa.ts';
import type { AssessmentDomainPermissions } from './contexts/learning/assessment/assessment.domain-permissions.ts';
import type { AssessmentEntityReference } from './contexts/learning/assessment/assessment.ts';
import type { AssessmentVisa } from './contexts/learning/assessment/assessment.visa.ts';
import type { CourseDomainPermissions } from './contexts/learning/course/course.domain-permissions.ts';
import type { CourseEntityReference } from './contexts/learning/course/course.ts';
import type { CourseVisa } from './contexts/learning/course/course.visa.ts';
import type { TeamOperationDomainPermissions } from './contexts/operations/team-operation/team-operation.domain-permissions.ts';
import type { TeamOperationEntityReference } from './contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationVisa } from './contexts/operations/team-operation/team-operation.visa.ts';
import type { OrganizationDomainPermissions } from './contexts/organization/organization.domain-permissions.ts';
import type { OrganizationPassport } from './contexts/organization/organization.passport.ts';
import type { OrganizationEntityReference } from './contexts/organization/organization.ts';
import type { OrganizationVisa } from './contexts/organization/organization.visa.ts';
import type { LearnerUserEntityReference } from './contexts/user/learner-user/learner-user.ts';
import type { StaffUserEntityReference } from './contexts/user/staff-user/staff-user.ts';
import type { UserDomainPermissions } from './contexts/user/user.domain-permissions.ts';
import type { UserPassport } from './contexts/user/user.passport.ts';
import type { UserVisa } from './contexts/user/user.visa.ts';
import { GuestPassport } from './iam/guest/guest.passport.ts';
import { MemberPassport } from './iam/member/member.passport.ts';
import { SystemPassport } from './iam/system/system.passport.ts';
import { StaffUserPassport } from './iam/user/staff-user/staff-user.passport.ts';

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

const buildPassport = (
	isGuest: boolean,
	canManageTeams: boolean,
	permissions: ScopedPermissions<CourseDomainPermissions, CourseEntityReference>,
	deliveryPermissions: ScopedPermissions<LearningDeliveryPermissions, LearningRecordEntityReference>,
	operationPermissions: ScopedPermissions<TeamOperationDomainPermissions, TeamOperationEntityReference>,
	userPermissions: UserDomainPermissions,
	options: PassportOptions = {},
): Passport => ({
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
		forAssessment: (assessment) => ({
			determineIf: (predicate) => predicate(typeof options.assessmentPermissions === 'function' ? options.assessmentPermissions(assessment) : (options.assessmentPermissions ?? noAssessmentPermissions)),
		}),
	},
	organization: {
		forOrganization: (organization): OrganizationVisa => ({
			determineIf: (predicate) => predicate(typeof options.organizationPermissions === 'function' ? options.organizationPermissions(organization) : (options.organizationPermissions ?? noOrganizationPermissions)),
		}),
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

export const PassportFactory = {
	/** An unauthenticated actor. See {@link GuestPassport}. */
	forGuest: (): Passport => GuestPassport.create(),
	/** A learner resolved from a raw external id, before a LearnerUser aggregate has been loaded. See {@link MemberPassport}. */
	forLearner: (learnerId: string, organizationId?: string): Passport => MemberPassport.forLearner(learnerId, organizationId),
	forInstructor: (): Passport =>
		buildPassport(
			false,
			false,
			{ ...noContentPermissions, canCreateCourses: true, canManageLearningContent: true },
			{ canSelfEnroll: false, canAssignLearning: false, canViewTeamLearning: false, canRecordProgress: false, canWaiveAssignments: false },
			{ canManageTeamOperations: false, canUpdateAssignedOperations: false, canEditTeamOperations: false, canDiscussTeamOperations: false, canConfirmTeamOperations: false },
			{ canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: false, isSystemAccount: false },
			{
				accessibleOrganizationIds: ['*'],
				assessmentPermissions: { canManageAssessments: true, canTakeAssessments: false, isSystemAccount: false },
				organizationPermissions: { canViewOrganization: true, canManageOrganizationStructure: false, isSystemAccount: false },
			},
		),
	/** A learner resolved from its fully loaded LearnerUser aggregate. See {@link MemberPassport}. */
	forLearnerUser: (learnerUser: LearnerUserEntityReference, organizationId?: string): Passport => MemberPassport.forLearnerUser(learnerUser, organizationId),
	/** A staff user, permissioned by their assigned role. See {@link StaffUserPassport}. */
	forStaffUser: (staffUser: StaffUserEntityReference, accessibleOrganizationIds?: readonly string[]): Passport => StaffUserPassport.create(staffUser, accessibleOrganizationIds),
	/** The trusted system actor used by background/integration workflows. See {@link SystemPassport}. */
	forSystem: (): Passport => SystemPassport.create(),
} as const;

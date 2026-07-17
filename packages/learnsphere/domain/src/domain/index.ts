export * as Contexts from './contexts/index.ts';
export { PassportFactory } from './passport-factory.ts';
export type { LearningContentVisa, LearningDeliveryPermissions, Passport } from './passport-factory.ts';
export type { CourseDomainPermissions } from './contexts/learning/course/course.domain-permissions.ts';
export type { LearningRecordDomainPermissions } from './contexts/delivery/learning-record/learning-record.domain-permissions.ts';
export type { UserDomainPermissions } from './contexts/user/user.domain-permissions.ts';
export type { UserPassport } from './contexts/user/user.passport.ts';
export type { UserVisa } from './contexts/user/user.visa.ts';
export type { LearnerUserEntityReference } from './contexts/user/learner-user/learner-user.ts';
export type { LearnerUserProps } from './contexts/user/learner-user/learner-user.ts';
export type { StaffRoleEntityReference, StaffRolePermissions, StaffRoleProps, StaffPortalPermissions } from './contexts/user/staff-role/staff-role.ts';
export type { StaffUserEntityReference, StaffUserProps } from './contexts/user/staff-user/staff-user.ts';
export type { StaffUserActivityLogProps } from './contexts/user/staff-user/staff-user.ts';
export type { AssessmentEntityReference, AssessmentProps } from './contexts/learning/assessment/assessment.ts';
export type { OrganizationEntityReference, OrganizationProps } from './contexts/organization/organization.ts';
import type { CourseUnitOfWork } from './contexts/learning/course/course.uow.ts';
import type { AssessmentUnitOfWork } from './contexts/learning/assessment/assessment.uow.ts';
import type { AssessmentAttemptUnitOfWork } from './contexts/delivery/assessment-attempt/assessment-attempt.uow.ts';
import type { LearningRecordUnitOfWork } from './contexts/delivery/learning-record/learning-record.uow.ts';
import type { TeamOperationUnitOfWork } from './contexts/operations/team-operation/team-operation.uow.ts';
import type { LearnerUserUnitOfWork } from './contexts/user/learner-user/learner-user.uow.ts';
import type { StaffRoleUnitOfWork } from './contexts/user/staff-role/staff-role.uow.ts';
import type { StaffUserUnitOfWork } from './contexts/user/staff-user/staff-user.uow.ts';
import type { OrganizationUnitOfWork } from './contexts/organization/organization.uow.ts';

export interface DomainDataSource {
	Delivery: { LearningRecord: { LearningRecordUnitOfWork: LearningRecordUnitOfWork }; AssessmentAttempt: { AssessmentAttemptUnitOfWork: AssessmentAttemptUnitOfWork } };
	Learning: { Course: { CourseUnitOfWork: CourseUnitOfWork }; Assessment: { AssessmentUnitOfWork: AssessmentUnitOfWork } };
	Operations: { TeamOperation: { TeamOperationUnitOfWork: TeamOperationUnitOfWork } };
	Organization: { OrganizationUnitOfWork: OrganizationUnitOfWork };
	User: {
		LearnerUser: { LearnerUserUnitOfWork: LearnerUserUnitOfWork };
		StaffRole: { StaffRoleUnitOfWork: StaffRoleUnitOfWork };
		StaffUser: { StaffUserUnitOfWork: StaffUserUnitOfWork };
	};
}

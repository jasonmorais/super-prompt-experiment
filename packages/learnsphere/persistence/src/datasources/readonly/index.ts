import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../index.ts';
import { DeliveryContext } from './delivery/index.ts';
import { LearningContext } from './learning/index.ts';
import type { CourseListOptions, CourseReadRepository } from './learning/course/index.ts';
import type { LearningRecordReadRepository } from './delivery/learning-record/index.ts';
import { OperationsContext } from './operations/index.ts';
import type { TeamOperationReadRepository } from './operations/index.ts';
import { UserContext } from './user/index.ts';
import { OrganizationContext } from './organization/index.ts';
import type { AssessmentReadRepository } from './learning/assessment/index.ts';
import type { AssessmentAttemptReadRepository } from './delivery/assessment-attempt/index.ts';
import type { OrganizationReadRepository } from './organization/index.ts';
import type * as LearnerUser from './user/learner-user/index.ts';
import type * as StaffRole from './user/staff-role/index.ts';
import type * as StaffUser from './user/staff-user/index.ts';

export interface ReadonlyDataSource {
	User: {
		LearnerUser: { LearnerUserReadRepo: LearnerUser.LearnerUserReadRepository };
		StaffRole: { StaffRoleReadRepo: StaffRole.StaffRoleReadRepository };
		StaffUser: { StaffUserReadRepo: StaffUser.StaffUserReadRepository };
	};
	Delivery: { LearningRecord: { LearningRecordReadRepo: LearningRecordReadRepository }; AssessmentAttempt: { AssessmentAttemptReadRepo: AssessmentAttemptReadRepository } };
	Learning: { Course: { CourseReadRepo: CourseReadRepository }; Assessment: { AssessmentReadRepo: AssessmentReadRepository } };
	Operations: { TeamOperation: { TeamOperationReadRepo: TeamOperationReadRepository } };
	Organization: { OrganizationReadRepo: OrganizationReadRepository };
}

export type { CourseListOptions, CourseReadRepository, LearningRecordReadRepository, TeamOperationReadRepository };

export const ReadonlyDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): ReadonlyDataSource => ({
	Delivery: DeliveryContext(models, passport),
	Learning: LearningContext(models, passport),
	Operations: OperationsContext(models, passport),
	Organization: OrganizationContext(models, passport),
	User: UserContext(models, passport),
});

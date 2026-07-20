import type { Domain, DomainDataSource } from '@learnsphere/domain';
import type { ModelsContext } from '../../index.ts';
import { getLearningRecordUnitOfWork } from './delivery/learning-record/learning-record.uow.ts';
import { getAssessmentAttemptUnitOfWork } from './delivery/assessment-attempt/assessment-attempt.uow.ts';
import { getCourseUnitOfWork } from './learning/course/course.uow.ts';
import { getAssessmentUnitOfWork } from './learning/assessment/assessment.uow.ts';
import { getOrganizationUnitOfWork } from './organization/organization.uow.ts';
import { getTeamOperationUnitOfWork } from './operations/team-operation/team-operation.uow.ts';
import { UserContextPersistence } from './user/index.ts';

export const DomainDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): DomainDataSource => ({
	Delivery: {
		LearningRecord: { LearningRecordUnitOfWork: getLearningRecordUnitOfWork(models.LearningRecord, passport) },
		AssessmentAttempt: { AssessmentAttemptUnitOfWork: getAssessmentAttemptUnitOfWork(models.AssessmentAttempt, passport) },
	},
	Learning: { Course: { CourseUnitOfWork: getCourseUnitOfWork(models.Course, passport) }, Assessment: { AssessmentUnitOfWork: getAssessmentUnitOfWork(models.Assessment, passport) } },
	Operations: { TeamOperation: { TeamOperationUnitOfWork: getTeamOperationUnitOfWork(models.TeamOperation, passport) } },
	Organization: { OrganizationUnitOfWork: getOrganizationUnitOfWork(models.Organization, passport) },
	User: UserContextPersistence(models, passport),
});

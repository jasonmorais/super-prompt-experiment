import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../index.ts';
import { DeliveryContext } from './delivery/index.ts';
import { LearningContext } from './learning/index.ts';
import type { CourseListOptions, CourseReadRepository } from './learning/course/index.ts';
import type { LearningRecordReadRepository } from './delivery/learning-record/index.ts';
import { OperationsContext } from './operations/index.ts';
import type { TeamOperationReadRepository } from './operations/index.ts';

export interface ReadonlyDataSource {
	Delivery: { LearningRecord: { LearningRecordReadRepo: LearningRecordReadRepository } };
	Learning: { Course: { CourseReadRepo: CourseReadRepository } };
	Operations: { TeamOperation: { TeamOperationReadRepo: TeamOperationReadRepository } };
}

export type { CourseListOptions, CourseReadRepository, LearningRecordReadRepository, TeamOperationReadRepository };

export const ReadonlyDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): ReadonlyDataSource => ({
	Delivery: DeliveryContext(models, passport),
	Learning: LearningContext(models, passport),
	Operations: OperationsContext(models, passport),
});

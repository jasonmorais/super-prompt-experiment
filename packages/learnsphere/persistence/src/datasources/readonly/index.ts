import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../index.ts';
import { DeliveryContext } from './delivery/index.ts';
import { LearningContext } from './learning/index.ts';
import type { CourseListOptions, CourseReadRepository } from './learning/course/index.ts';
import type { LearningRecordReadRepository } from './delivery/learning-record/index.ts';

export interface ReadonlyDataSource {
	Delivery: { LearningRecord: { LearningRecordReadRepo: LearningRecordReadRepository } };
	Learning: { Course: { CourseReadRepo: CourseReadRepository } };
}

export type { CourseListOptions, CourseReadRepository, LearningRecordReadRepository };

export const ReadonlyDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): ReadonlyDataSource => ({
	Delivery: DeliveryContext(models, passport),
	Learning: LearningContext(models, passport),
});

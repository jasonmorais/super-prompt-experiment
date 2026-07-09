import type { Domain } from '@axc/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getCourseReadRepository } from './course.read-repository.ts';

export type { CourseReadRepository } from './course.read-repository.ts';

export const CourseReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	CourseReadRepo: getCourseReadRepository(models, passport),
});

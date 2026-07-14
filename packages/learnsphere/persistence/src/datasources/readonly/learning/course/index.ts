import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getCourseReadRepository } from './course.read-repository.ts';

export type { CourseListOptions, CourseReadRepository } from './course.read-repository.ts';

export const CourseContext = (models: ModelsContext, passport: Domain.Passport) => ({
	CourseReadRepo: getCourseReadRepository(models, passport),
});

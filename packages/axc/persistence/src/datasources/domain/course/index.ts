import type { Domain } from '@axc/domain';
import type { ModelsContext } from '../../../index.ts';
import * as Course from './course/index.ts';

export const CourseContextPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	Course: Course.CoursePersistence(models, passport),
});

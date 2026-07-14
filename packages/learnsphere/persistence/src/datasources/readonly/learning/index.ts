import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../index.ts';
import { CourseContext } from './course/index.ts';

export const LearningContext = (models: ModelsContext, passport: Domain.Passport) => ({
	Course: CourseContext(models, passport),
});

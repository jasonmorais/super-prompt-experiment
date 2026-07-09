import type { Domain, DomainDataSource } from '@axc/domain';
import type { ModelsContext } from '../../index.ts';
import { CourseContextPersistence } from './course/index.ts';

export const DomainDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): DomainDataSource => ({
	Course: CourseContextPersistence(models, passport),
});

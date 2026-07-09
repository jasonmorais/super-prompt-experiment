import type { Domain } from '@axc/domain';
import type { ModelsContext } from '../../index.ts';
import type * as Course from './course/course/index.ts';
import { CourseContext } from './course/index.ts';

export interface ReadonlyDataSource {
	Course: {
		Course: {
			CourseReadRepo: Course.CourseReadRepository;
		};
	};
}

export const ReadonlyDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): ReadonlyDataSource => ({
	Course: CourseContext(models, passport),
});

import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { CourseModelFactory } from './courses.ts';
export type { Course, CourseModelType } from './courses.ts';

/**
 * Builds the map of Mongoose models used by the persistence layer.
 *
 * Empty in the blank scaffold. Add entries of the form
 * `MyModel: MyModelFactory(initializedService)` for each aggregate you persist.
 */
export const mongooseContextBuilder = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}
	return {
		Course: CourseModelFactory(initializedService),
	} as const;
};

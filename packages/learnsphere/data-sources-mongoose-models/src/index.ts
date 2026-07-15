import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { CourseModelFactory } from './models/learning/course.model.ts';
import { LearningRecordModelFactory } from './models/delivery/learning-record.model.ts';
import { TeamOperationModelFactory } from './models/operations/team-operation.model.ts';
import { TeamModelFactory } from './models/teams/team.model.ts';

export type { Course, CourseModelType } from './models/learning/course.model.ts';
export type { LearningRecord, LearningRecordModelType } from './models/delivery/learning-record.model.ts';
export type { TeamOperation, TeamOperationModelType } from './models/operations/team-operation.model.ts';
export type { Team, TeamMember, TeamModelType } from './models/teams/team.model.ts';

/**
 * Builds the map of Mongoose models used by the persistence layer.
 *
 * Each persisted aggregate is registered here for the persistence composition root.
 */
export const mongooseContextBuilder = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}
	return { Course: CourseModelFactory(initializedService), LearningRecord: LearningRecordModelFactory(initializedService), TeamOperation: TeamOperationModelFactory(initializedService), Team: TeamModelFactory(initializedService) } as const;
};

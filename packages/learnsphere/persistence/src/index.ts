import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { mongooseContextBuilder } from '@learnsphere/data-sources-mongoose-models';
import { DataSourcesFactoryImpl } from './datasources/index.ts';

export type ModelsContext = ReturnType<typeof mongooseContextBuilder>;
export type { DataSources, DataSourcesFactory, ReadonlyDataSource } from './datasources/index.ts';
export type { TeamDataSource, TeamRecord } from './datasources/teams/team-data-source.ts';
export type { LearnerUserReadRepository } from './datasources/readonly/user/learner-user/index.ts';
export type { StaffRoleReadRepository } from './datasources/readonly/user/staff-role/index.ts';
export type { StaffUserReadRepository } from './datasources/readonly/user/staff-user/index.ts';

/**
 * Builds the application's data-source factory from a connected Mongoose
 * context. The returned factory produces passport-scoped read/write data
 * sources for the application-services layer.
 */
export const Persistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}
	const models: ModelsContext = { ...mongooseContextBuilder(initializedService) };
	return DataSourcesFactoryImpl(models);
};

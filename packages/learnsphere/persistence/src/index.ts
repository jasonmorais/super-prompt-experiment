import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { mongooseContextBuilder } from '@learnsphere/data-sources-mongoose-models';
import { DataSourcesFactoryImpl } from './datasources/index.ts';

export type ModelsContext = ReturnType<typeof mongooseContextBuilder>;
export type { DataSources, DataSourcesFactory, ReadonlyDataSource } from './datasources/index.ts';

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

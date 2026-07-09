import { Domain, type DomainDataSource } from '@axc/domain';
import type { ModelsContext } from '../index.ts';
import { DomainDataSourceImplementation } from './domain/index.ts';
import { type ReadonlyDataSource, ReadonlyDataSourceImplementation } from './readonly/index.ts';

export type { ReadonlyDataSource } from './readonly/index.ts';

/** Passport-scoped read/write data sources handed to application services. */
export type DataSources = {
	domainDataSource: DomainDataSource;
	readonlyDataSource: ReadonlyDataSource;
};

/** Produces {@link DataSources} scoped to a caller's passport. */
export type DataSourcesFactory = {
	withPassport: (passport: Domain.Passport) => DataSources;
	withSystemPassport: () => DataSources;
};

/**
 * Default {@link DataSourcesFactory} implementation. Builds passport-scoped
 * domain (write, unit-of-work) and readonly (query) data sources from the
 * Mongoose models, mirroring the Community context.
 */
export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
	const withPassport = (passport: Domain.Passport): DataSources => ({
		domainDataSource: DomainDataSourceImplementation(models, passport),
		readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
	});
	const withSystemPassport = (): DataSources => withPassport(Domain.PassportFactory.forSystem());
	return { withPassport, withSystemPassport };
};

import type { DomainDataSource, Passport } from '@simnova/domain';

/**
 * Read-only (query) data sources. Empty in the blank scaffold; add read
 * repositories per bounded context here.
 */
export interface ReadonlyDataSource {}

/** Passport-scoped read/write data sources handed to application services. */
export interface DataSources {
	readonly domainDataSource: DomainDataSource;
	readonly readonlyDataSource: ReadonlyDataSource;
}

/** Produces {@link DataSources} scoped to a caller's {@link Passport}. */
export interface DataSourcesFactory {
	withPassport(passport: Passport): DataSources;
	withSystemPassport(): DataSources;
}

/**
 * Default {@link DataSourcesFactory} implementation. The blank scaffold returns
 * empty data sources; wire your Mongoose-backed repositories through `models`.
 */
export const DataSourcesFactoryImpl = (_models: Record<string, unknown>): DataSourcesFactory => {
	const build = (): DataSources => ({ domainDataSource: {}, readonlyDataSource: {} });
	return {
		withPassport: (_passport: Passport): DataSources => build(),
		withSystemPassport: (): DataSources => build(),
	};
};

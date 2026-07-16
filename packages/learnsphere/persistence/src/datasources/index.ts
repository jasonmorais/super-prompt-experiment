import { Domain, type DomainDataSource, type Passport } from '@learnsphere/domain';
import type { ModelsContext } from '../index.ts';
import { DomainDataSourceImplementation } from './domain/index.ts';
import { ReadonlyDataSourceImplementation, type ReadonlyDataSource } from './readonly/index.ts';
import { getTeamDataSource, type TeamDataSource } from './teams/team-data-source.ts';

export type DataSources = { readonly domainDataSource: DomainDataSource; readonly readonlyDataSource: ReadonlyDataSource; readonly teamDataSource: TeamDataSource };
export type DataSourcesFactory = { withPassport(passport: Passport): DataSources; withSystemPassport(): DataSources };
export type { ReadonlyDataSource } from './readonly/index.ts';

export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
	const withPassport = (passport: Passport): DataSources => ({
		domainDataSource: DomainDataSourceImplementation(models, passport),
		readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
		teamDataSource: getTeamDataSource(models),
	});
	return {
		withPassport,
		withSystemPassport: () => withPassport(Domain.PassportFactory.forSystem()),
	};
};

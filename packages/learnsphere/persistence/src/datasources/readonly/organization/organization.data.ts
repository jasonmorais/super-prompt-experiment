import type { Organization } from '@learnsphere/data-sources-mongoose-models';
import { type MongoDataSource, MongoDataSourceImpl } from '../mongo-data-source.ts';

export interface OrganizationDataSource extends MongoDataSource<Organization> {}

export class OrganizationDataSourceImpl extends MongoDataSourceImpl<Organization> implements OrganizationDataSource {}

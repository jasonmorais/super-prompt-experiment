import type { Course } from '@axc/data-sources-mongoose-models';
import { type MongoDataSource, MongoDataSourceImpl } from '../../mongo-data-source.ts';

/**
 * Read-model data source for the Course collection. Mirrors the Community
 * context's `community.data.ts`.
 */
export interface CourseDataSource extends MongoDataSource<Course> {}

export class CourseDataSourceImpl extends MongoDataSourceImpl<Course> implements CourseDataSource {}

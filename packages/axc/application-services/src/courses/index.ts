import type { Domain } from '@axc/domain';
import type { DataSources } from '@axc/persistence';
import { type CourseQueryAllCommand, queryAll } from './query-all.ts';
import { type CourseQueryByIdCommand, queryById } from './query-by-id.ts';

export type { CourseQueryAllCommand, CourseQueryByIdCommand };

/**
 * Application service for the Course context. Mirrors the Community context's
 * `CommunityApplicationService`: exposes intention-revealing query methods that
 * delegate to the passport-scoped read model.
 */
export interface CourseApplicationService {
	queryAll: (command?: CourseQueryAllCommand) => Promise<Domain.Contexts.Course.Course.CourseEntityReference[]>;
	queryById: (command: CourseQueryByIdCommand) => Promise<Domain.Contexts.Course.Course.CourseEntityReference | null>;
}

export const Course = (dataSources: DataSources): CourseApplicationService => {
	return {
		queryAll: queryAll(dataSources),
		queryById: queryById(dataSources),
	};
};

import type { Domain } from '@axc/domain';
import type { DataSources } from '@axc/persistence';

export interface CourseQueryAllCommand {
	fields?: string[];
}

export const queryAll = (dataSources: DataSources) => {
	return async (command?: CourseQueryAllCommand): Promise<Domain.Contexts.Course.Course.CourseEntityReference[]> => {
		return await dataSources.readonlyDataSource.Course.Course.CourseReadRepo.getAll({ fields: command?.fields });
	};
};

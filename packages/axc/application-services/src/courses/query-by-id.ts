import type { Domain } from '@axc/domain';
import type { DataSources } from '@axc/persistence';

export interface CourseQueryByIdCommand {
	id: string;
	fields?: string[];
}

export const queryById = (dataSources: DataSources) => {
	return async (command: CourseQueryByIdCommand): Promise<Domain.Contexts.Course.Course.CourseEntityReference | null> => {
		return await dataSources.readonlyDataSource.Course.Course.CourseReadRepo.getById(command.id, { fields: command.fields });
	};
};

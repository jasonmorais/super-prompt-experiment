import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export interface CourseListCommand {
	organizationId: string;
	status?: Domain.Contexts.Learning.Course.CourseStatus;
	search?: string;
	limit?: number;
}

export const list = (dataSources: DataSources) => (command: CourseListCommand) => dataSources.readonlyDataSource.Learning.Course.CourseReadRepo.list(command);

import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';

export interface CourseQueryByIdCommand {
	id: string;
	organizationId?: string;
	learnerId?: string;
}

export const queryById =
	(dataSources: DataSources) =>
	(command: CourseQueryByIdCommand): Promise<Domain.Contexts.Learning.Course.CourseEntityReference | null> =>
	dataSources.readonlyDataSource.Learning.Course.CourseReadRepo.getById(command.id, { ...(command.organizationId ? { organizationId: command.organizationId } : {}), ...(command.learnerId ? { learnerId: command.learnerId } : {}) });

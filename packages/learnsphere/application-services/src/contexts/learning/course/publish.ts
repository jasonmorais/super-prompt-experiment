import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';
import { mutate } from './mutate.ts';

export const publish =
	(dataSources: DataSources): ((command: { id: string }) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference>) =>
	(command) =>
		mutate(dataSources, command.id, (course) => course.publish());

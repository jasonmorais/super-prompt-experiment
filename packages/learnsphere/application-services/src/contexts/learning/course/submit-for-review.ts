import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';
import { mutate } from './mutate.ts';

export interface CourseIdCommand {
	id: string;
}

export const submitForReview =
	(dataSources: DataSources): ((command: CourseIdCommand) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference>) =>
	(command) =>
		mutate(dataSources, command.id, (course) => course.submitForReview());

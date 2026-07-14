import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';
import { mutate } from './mutate.ts';

export interface CourseModuleCommand {
	courseId: string;
	module: Omit<Domain.Contexts.Learning.Course.CourseModule, 'order'>;
}

export const addModule = (dataSources: DataSources) => (command: CourseModuleCommand) => mutate(dataSources, command.courseId, (course) => course.addModule(command.module));

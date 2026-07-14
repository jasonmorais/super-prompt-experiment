import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { addModule } from './add-module.ts';
import { create, type CourseCreateCommand } from './create.ts';
import { deleteCourse } from './delete.ts';
import { update, type CourseUpdateCommand } from './update.ts';
import { list, type CourseListCommand } from './list.ts';
import { publish } from './publish.ts';
import { queryById, type CourseQueryByIdCommand } from './query-by-id.ts';
import { submitForReview } from './submit-for-review.ts';

export type { CourseCreateCommand };
export type { CourseUpdateCommand };

export interface CourseApplicationService {
	create: (command: CourseCreateCommand) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
	queryById: (command: CourseQueryByIdCommand) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference | null>;
	list: (command: CourseListCommand) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference[]>;
	addModule: (command: { courseId: string; module: Omit<Domain.Contexts.Learning.Course.CourseModule, 'order'> }) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
	submitForReview: (command: { id: string }) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
	publish: (command: { id: string }) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
	update: (command: CourseUpdateCommand) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
	delete: (command: { id: string }) => Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
}

export const Course = (dataSources: DataSources, createdBy: string): CourseApplicationService => ({
	create: create(dataSources, createdBy),
	queryById: queryById(dataSources),
	list: list(dataSources),
	addModule: addModule(dataSources),
	submitForReview: submitForReview(dataSources),
	publish: publish(dataSources),
	update: update(dataSources),
	delete: deleteCourse(dataSources),
});

import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export interface CourseUpdateCommand {
	id: string;
	title: string;
	summary: string;
	description: string;
	level: Domain.Contexts.Learning.Course.CourseLevel;
	category: string;
	tags: string[];
	skills: string[];
	discoverability: Domain.Contexts.Learning.Course.CourseDiscoverability;
	requiresCompletionScreenshot: boolean;
}

export const update = (dataSources: DataSources) => async (command: CourseUpdateCommand): Promise<Domain.Contexts.Learning.Course.CourseEntityReference> => {
	let result: Domain.Contexts.Learning.Course.CourseEntityReference | undefined;
	await dataSources.domainDataSource.Learning.Course.CourseUnitOfWork.withScopedTransaction(async (repo) => {
		const course = await repo.get(command.id);
		course.updateDetails(command);
		result = await repo.save(course);
	});
	if (!result) throw new Error(`Course ${command.id} was not updated`);
	return result;
};

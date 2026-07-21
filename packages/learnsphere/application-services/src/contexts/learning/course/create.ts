import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';

export interface CourseCreateCommand {
	organizationId: string;
	title: string;
	summary: string;
	description: string;
	level: Domain.Contexts.Learning.Course.CourseLevel;
	category: string;
	tags?: string[];
	skills?: string[];
	discoverability?: Domain.Contexts.Learning.Course.CourseDiscoverability;
	requiresCompletionScreenshot?: boolean;
}

export const create =
	(dataSources: DataSources, createdBy: string) =>
	async (command: CourseCreateCommand): Promise<Domain.Contexts.Learning.Course.CourseEntityReference> => {
		let result: Domain.Contexts.Learning.Course.CourseEntityReference | undefined;
		await dataSources.domainDataSource.Learning.Course.CourseUnitOfWork.withScopedTransaction(async (repo) => {
			const course = await repo.getNewInstance({ ...command, createdBy, discoverability: command.discoverability ?? 'CATALOG', requiresCompletionScreenshot: command.requiresCompletionScreenshot ?? false });
			course.setTaxonomy(command.tags ?? [], command.skills ?? []);
			result = await repo.save(course);
		});
		if (!result) throw new Error('Course was not created');
		return result;
	};

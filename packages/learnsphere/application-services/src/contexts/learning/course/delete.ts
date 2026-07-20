import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const deleteCourse =
	(dataSources: DataSources) =>
	async (command: { id: string }): Promise<Domain.Contexts.Learning.Course.CourseEntityReference> => {
		let result: Domain.Contexts.Learning.Course.CourseEntityReference | undefined;
		await dataSources.domainDataSource.Learning.Course.CourseUnitOfWork.withScopedTransaction(async (repo) => {
			const course = await repo.get(command.id);
			course.delete();
			result = await repo.save(course);
		});
		if (!result) throw new Error(`Course ${command.id} was not deleted`);
		return result;
	};

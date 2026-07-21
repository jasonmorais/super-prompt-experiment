import type { DataSources } from '@learnsphere/persistence';
import type { Domain } from '@learnsphere/domain';

export const mutate = async (dataSources: DataSources, id: string, action: (course: Domain.Contexts.Learning.Course.Course) => void): Promise<Domain.Contexts.Learning.Course.CourseEntityReference> => {
	let result: Domain.Contexts.Learning.Course.CourseEntityReference | undefined;
	await dataSources.domainDataSource.Learning.Course.CourseUnitOfWork.withScopedTransaction(async (repo) => {
		const course = await repo.get(id);
		action(course);
		result = await repo.save(course);
	});
	if (!result) throw new Error(`Course ${id} was not saved`);
	return result;
};

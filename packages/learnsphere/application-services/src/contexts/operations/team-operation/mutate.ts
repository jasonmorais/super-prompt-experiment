import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const mutate = async (
	dataSources: DataSources,
	id: string,
	action: (operation: Domain.Contexts.Operations.TeamOperation.TeamOperation) => void,
): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference> => {
	let result: Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference | undefined;
	await dataSources.domainDataSource.Operations.TeamOperation.TeamOperationUnitOfWork.withScopedTransaction(async (repo) => {
		const operation = await repo.get(id);
		action(operation);
		result = await repo.save(operation);
	});
	if (!result) throw new Error(`Team operation ${id} was not saved`);
	return result;
};

export const mutateDiscussion = async (
	dataSources: DataSources,
	id: string,
	action: (operation: Domain.Contexts.Operations.TeamOperation.TeamOperation) => void,
): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference> => mutate(dataSources, id, action);

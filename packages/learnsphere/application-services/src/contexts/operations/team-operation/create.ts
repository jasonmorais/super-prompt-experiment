import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export interface TeamOperationCreateCommand {
	organizationId: string;
	title: string;
	description: string;
	category: string;
	priority: Domain.Contexts.Operations.TeamOperation.TeamOperationPriority;
	assigneeId: string;
	assigneeDisplayName: string;
	assigneeEmail: string;
	teamName: string;
	dueAt?: Date;
	createdBy: string;
}

export const create =
	(dataSources: DataSources) =>
	async (command: TeamOperationCreateCommand): Promise<Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference> => {
		let result: Domain.Contexts.Operations.TeamOperation.TeamOperationEntityReference | undefined;
		await dataSources.domainDataSource.Operations.TeamOperation.TeamOperationUnitOfWork.withScopedTransaction(async (repo) => {
			const operation = await repo.getNewInstance({ ...command, dueAt: command.dueAt ?? null });
			result = await repo.save(operation);
		});
		if (!result) throw new Error('Team operation was not created');
		return result;
	};

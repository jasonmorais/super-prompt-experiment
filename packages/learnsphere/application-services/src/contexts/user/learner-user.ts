import type { Domain } from '@learnsphere/domain';
import { Domain as DomainRuntime } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export interface LearnerUserCreateIfNotExistsCommand {
	externalId: string;
	lastName: string;
	restOfName?: string;
	email: string;
}

export const LearnerUser = (dataSources: DataSources) => ({
	createIfNotExists: async (command: LearnerUserCreateIfNotExistsCommand): Promise<Domain.Contexts.User.LearnerUser.LearnerUserEntityReference> => {
		const existing = await dataSources.readonlyDataSource.User.LearnerUser.LearnerUserReadRepo.getByExternalId(command.externalId);
		if (existing) return existing;
		let created: Domain.Contexts.User.LearnerUser.LearnerUserEntityReference | undefined;
		await dataSources.domainDataSource.User.LearnerUser.LearnerUserUnitOfWork.withTransaction(DomainRuntime.PassportFactory.forSystem(), async (repository) => {
			created = await repository.save(await repository.getNewInstance(command.externalId, command.lastName, command.restOfName, command.email));
		});
		if (!created) throw new Error('Unable to create learner user');
		return created;
	},
	queryByExternalId: (externalId: string) => dataSources.readonlyDataSource.User.LearnerUser.LearnerUserReadRepo.getByExternalId(externalId),
});

export type LearnerUserApplicationService = ReturnType<typeof LearnerUser>;

import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const unassign =
	(dataSources: DataSources) =>
	async (command: { id: string }): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference> => {
		let result: Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference | undefined;
		await dataSources.domainDataSource.Delivery.LearningRecord.LearningRecordUnitOfWork.withScopedTransaction(async (repo) => {
			const record = await repo.get(command.id);
			record.unassign();
			result = await repo.save(record);
		});
		if (!result) throw new Error(`Learning record ${command.id} was not unassigned`);
		return result;
	};

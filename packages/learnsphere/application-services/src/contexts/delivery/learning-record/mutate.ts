import type { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export const mutate = async (
	dataSources: DataSources,
	id: string,
	action: (record: Domain.Contexts.Delivery.LearningRecord.LearningRecord) => void,
): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference> => {
	let result: Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference | undefined;
	await dataSources.domainDataSource.Delivery.LearningRecord.LearningRecordUnitOfWork.withScopedTransaction(async (repo) => {
		const record = await repo.get(id);
		action(record);
		result = await repo.save(record);
	});
	if (!result) throw new Error(`Learning record ${id} was not saved`);
	return result;
};

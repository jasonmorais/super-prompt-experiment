import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { LearningRecord as LearningRecordDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
import type { LearningRecordDomainAdapter } from './learning-record.domain-adapter.ts';

export class LearningRecordRepository
	extends MongooseSeedwork.MongoRepositoryBase<LearningRecordDocument, LearningRecordDomainAdapter, Domain.Passport, Domain.Contexts.Delivery.LearningRecord.LearningRecord<LearningRecordDomainAdapter>>
	implements Domain.Contexts.Delivery.LearningRecord.LearningRecordRepository<LearningRecordDomainAdapter>
{
	getNewInstance(input: Domain.Contexts.Delivery.LearningRecord.NewLearningRecordInput) {
		return Promise.resolve(Domain.Contexts.Delivery.LearningRecord.LearningRecord.getNewInstance(this.typeConverter.toAdapter(new this.model()), input, this.passport));
	}
}

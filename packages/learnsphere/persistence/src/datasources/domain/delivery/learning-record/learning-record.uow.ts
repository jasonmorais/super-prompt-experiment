import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { LearningRecordModelType } from '@learnsphere/data-sources-mongoose-models';
import type { Domain } from '@learnsphere/domain';
import { LearningRecordConverter } from './learning-record.domain-adapter.ts';
import { LearningRecordRepository } from './learning-record.repository.ts';

export const getLearningRecordUnitOfWork = (model: LearningRecordModelType, passport: Domain.Passport): Domain.Contexts.Delivery.LearningRecord.LearningRecordUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new LearningRecordConverter(), LearningRecordRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};

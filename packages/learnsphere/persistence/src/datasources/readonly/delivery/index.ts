import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../index.ts';
import { LearningRecordContext } from './learning-record/index.ts';

export const DeliveryContext = (models: ModelsContext, passport: Domain.Passport) => ({
	LearningRecord: LearningRecordContext(models, passport),
});

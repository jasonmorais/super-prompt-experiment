import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { AssessmentModelType } from '@learnsphere/data-sources-mongoose-models';
import type { Domain } from '@learnsphere/domain';
import { AssessmentConverter } from './assessment.domain-adapter.ts';
import { AssessmentRepository } from './assessment.repository.ts';
export const getAssessmentUnitOfWork = (model: AssessmentModelType, passport: Domain.Passport): Domain.Contexts.Learning.Assessment.AssessmentUnitOfWork =>
	MongooseSeedwork.getInitializedUnitOfWork(new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new AssessmentConverter(), AssessmentRepository), passport);

import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { LearnerUserModelType } from '@learnsphere/data-sources-mongoose-models';
import type { Domain } from '@learnsphere/domain';
import { LearnerUserConverter } from './learner-user.domain-adapter.ts';
import { LearnerUserRepository } from './learner-user.repository.ts';

export const getLearnerUserUnitOfWork = (model: LearnerUserModelType, passport: Domain.Passport): Domain.Contexts.User.LearnerUser.LearnerUserUnitOfWork => MongooseSeedwork.getInitializedUnitOfWork(new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new LearnerUserConverter(), LearnerUserRepository), passport);

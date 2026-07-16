import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { StaffUserModelType } from '@learnsphere/data-sources-mongoose-models';
import type { Domain } from '@learnsphere/domain';
import { StaffUserConverter } from './staff-user.domain-adapter.ts';
import { StaffUserRepository } from './staff-user.repository.ts';

export const getStaffUserUnitOfWork = (model: StaffUserModelType, passport: Domain.Passport): Domain.Contexts.User.StaffUser.StaffUserUnitOfWork => MongooseSeedwork.getInitializedUnitOfWork(new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new StaffUserConverter(), StaffUserRepository), passport);

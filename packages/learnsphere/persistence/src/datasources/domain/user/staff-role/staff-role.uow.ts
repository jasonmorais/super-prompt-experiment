import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { StaffRoleModelType } from '@learnsphere/data-sources-mongoose-models';
import type { Domain } from '@learnsphere/domain';
import { StaffRoleConverter } from './staff-role.domain-adapter.ts';
import { StaffRoleRepository } from './staff-role.repository.ts';

export const getStaffRoleUnitOfWork = (model: StaffRoleModelType, passport: Domain.Passport): Domain.Contexts.User.StaffRole.StaffRoleUnitOfWork =>
	MongooseSeedwork.getInitializedUnitOfWork(new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new StaffRoleConverter(), StaffRoleRepository), passport);

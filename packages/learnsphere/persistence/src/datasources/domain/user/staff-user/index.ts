import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getStaffUserUnitOfWork } from './staff-user.uow.ts';

export const StaffUserPersistence = (models: ModelsContext, passport: Domain.Passport) => ({ StaffUserUnitOfWork: getStaffUserUnitOfWork(models.StaffUser, passport) });

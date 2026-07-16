import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getStaffRoleUnitOfWork } from './staff-role.uow.ts';

export const StaffRolePersistence = (models: ModelsContext, passport: Domain.Passport) => ({ StaffRoleUnitOfWork: getStaffRoleUnitOfWork(models.StaffRole, passport) });

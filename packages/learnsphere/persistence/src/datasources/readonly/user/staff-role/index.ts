import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getStaffRoleReadRepository, type StaffRoleReadRepository } from './staff-role.read-repository.ts';
export type { StaffRoleReadRepository } from './staff-role.read-repository.ts';
export const StaffRoleReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport): { StaffRoleReadRepo: StaffRoleReadRepository } => ({ StaffRoleReadRepo: getStaffRoleReadRepository(models, passport) });

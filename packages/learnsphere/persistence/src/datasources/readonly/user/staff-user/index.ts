import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getStaffUserReadRepository, type StaffUserReadRepository } from './staff-user.read-repository.ts';
export type { StaffUserReadRepository } from './staff-user.read-repository.ts';
export const StaffUserReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport): { StaffUserReadRepo: StaffUserReadRepository } => ({ StaffUserReadRepo: getStaffUserReadRepository(models, passport) });

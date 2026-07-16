import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../../index.ts';
import { LearnerUserReadRepositoryImpl } from './learner-user/index.ts';
import { StaffRoleReadRepositoryImpl } from './staff-role/index.ts';
import { StaffUserReadRepositoryImpl } from './staff-user/index.ts';

export const UserContext = (models: ModelsContext, passport: Domain.Passport) => ({ LearnerUser: LearnerUserReadRepositoryImpl(models, passport), StaffRole: StaffRoleReadRepositoryImpl(models, passport), StaffUser: StaffUserReadRepositoryImpl(models, passport) });

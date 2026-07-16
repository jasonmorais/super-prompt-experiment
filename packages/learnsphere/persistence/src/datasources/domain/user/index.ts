import type { Domain, DomainDataSource } from '@learnsphere/domain';
import type { ModelsContext } from '../../../index.ts';
import { LearnerUserPersistence } from './learner-user/index.ts';
import { StaffRolePersistence } from './staff-role/index.ts';
import { StaffUserPersistence } from './staff-user/index.ts';

export const UserContextPersistence = (models: ModelsContext, passport: Domain.Passport): DomainDataSource['User'] => ({
	LearnerUser: LearnerUserPersistence(models, passport),
	StaffRole: StaffRolePersistence(models, passport),
	StaffUser: StaffUserPersistence(models, passport),
});

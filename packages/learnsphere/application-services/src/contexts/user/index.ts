import type { DataSources } from '@learnsphere/persistence';
import { LearnerUser as LearnerUserApi, type LearnerUserApplicationService } from './learner-user.ts';
import { StaffRole, type StaffRoleApplicationService } from './staff-role.ts';
import { StaffUser, type StaffUserApplicationService } from './staff-user.ts';

export interface UserContextApplicationService {
	LearnerUser: LearnerUserApplicationService;
	StaffRole: StaffRoleApplicationService;
	StaffUser: StaffUserApplicationService;
}

export const User = (dataSources: DataSources): UserContextApplicationService => ({ LearnerUser: LearnerUserApi(dataSources), StaffRole: StaffRole(dataSources), StaffUser: StaffUser(dataSources) });

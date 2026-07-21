import type { LearnerUserEntityReference } from './learner-user/learner-user.ts';
import type { StaffRoleEntityReference } from './staff-role/staff-role.ts';
import type { StaffUserEntityReference } from './staff-user/staff-user.ts';
import type { UserVisa } from './user.visa.ts';

export interface UserPassport {
	forLearnerUser(root: LearnerUserEntityReference): UserVisa;
	forStaffUser(root: StaffUserEntityReference): UserVisa;
	forStaffRole(root: StaffRoleEntityReference): UserVisa;
}

import type { LearnerUserEntityReference } from '../../../contexts/user/learner-user/learner-user.ts';
import type { StaffRoleEntityReference } from '../../../contexts/user/staff-role/staff-role.ts';
import type { StaffUserEntityReference } from '../../../contexts/user/staff-user/staff-user.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';
import { GuestUserVisa } from './guest.user.visa.ts';

export class GuestUserPassport implements UserPassport {
	forLearnerUser(_root: LearnerUserEntityReference): UserVisa {
		return new GuestUserVisa();
	}
	forStaffUser(_root: StaffUserEntityReference): UserVisa {
		return new GuestUserVisa();
	}
	forStaffRole(_root: StaffRoleEntityReference): UserVisa {
		return new GuestUserVisa();
	}
}

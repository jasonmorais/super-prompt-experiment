import type { LearnerUserEntityReference } from '../../../../contexts/user/learner-user/learner-user.ts';
import type { StaffRoleEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';
import type { StaffUserEntityReference } from '../../../../contexts/user/staff-user/staff-user.ts';
import type { UserPassport } from '../../../../contexts/user/user.passport.ts';
import type { UserVisa } from '../../../../contexts/user/user.visa.ts';
import { StaffUserUserVisa } from './staff-user.user.visa.ts';

export class StaffUserUserPassport implements UserPassport {
	private readonly staffUser: StaffUserEntityReference;
	private readonly canManageStaffRolesAndPermissions: boolean;
	private readonly canManageStaffUsers: boolean;

	constructor(staffUser: StaffUserEntityReference, canManageStaffRolesAndPermissions: boolean, canManageStaffUsers: boolean) {
		this.staffUser = staffUser;
		this.canManageStaffRolesAndPermissions = canManageStaffRolesAndPermissions;
		this.canManageStaffUsers = canManageStaffUsers;
	}

	private isOwnAccount(rootExternalId: string): boolean {
		return rootExternalId === this.staffUser.externalId;
	}

	forLearnerUser(root: LearnerUserEntityReference): UserVisa {
		return new StaffUserUserVisa(this.canManageStaffRolesAndPermissions, this.canManageStaffUsers, this.isOwnAccount(root.externalId));
	}
	forStaffUser(root: StaffUserEntityReference): UserVisa {
		return new StaffUserUserVisa(this.canManageStaffRolesAndPermissions, this.canManageStaffUsers, this.isOwnAccount(root.externalId));
	}
	// A staff user's own-account status never carries over to staff-role visas.
	forStaffRole(_root: StaffRoleEntityReference): UserVisa {
		return new StaffUserUserVisa(this.canManageStaffRolesAndPermissions, this.canManageStaffUsers, false);
	}
}

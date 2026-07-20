import type { UserDomainPermissions } from '../../../../contexts/user/user.domain-permissions.ts';
import type { UserVisa } from '../../../../contexts/user/user.visa.ts';

/** A staff user's user-management permissions are derived from their role. */
export class StaffUserUserVisa implements UserVisa {
	private readonly canManageStaffRolesAndPermissions: boolean;
	private readonly canManageStaffUsers: boolean;
	private readonly isEditingOwnAccount: boolean;

	constructor(canManageStaffRolesAndPermissions: boolean, canManageStaffUsers: boolean, isEditingOwnAccount: boolean) {
		this.canManageStaffRolesAndPermissions = canManageStaffRolesAndPermissions;
		this.canManageStaffUsers = canManageStaffUsers;
		this.isEditingOwnAccount = isEditingOwnAccount;
	}

	determineIf(predicate: (permissions: Readonly<UserDomainPermissions>) => boolean): boolean {
		return predicate({
			canManageLearnerUsers: false,
			canManageStaffRolesAndPermissions: this.canManageStaffRolesAndPermissions,
			canManageStaffUsers: this.canManageStaffUsers,
			isEditingOwnAccount: this.isEditingOwnAccount,
			isSystemAccount: false,
		});
	}
}

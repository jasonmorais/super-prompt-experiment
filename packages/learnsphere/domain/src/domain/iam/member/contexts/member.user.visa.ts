import type { UserDomainPermissions } from '../../../contexts/user/user.domain-permissions.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';

/** A member never manages other users; may only ever edit their own account. */
export class MemberUserVisa implements UserVisa {
	private readonly isEditingOwnAccount: boolean;

	constructor(isEditingOwnAccount: boolean) {
		this.isEditingOwnAccount = isEditingOwnAccount;
	}

	determineIf(predicate: (permissions: Readonly<UserDomainPermissions>) => boolean): boolean {
		return predicate({ canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: this.isEditingOwnAccount, isSystemAccount: false });
	}
}

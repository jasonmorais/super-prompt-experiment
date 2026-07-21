import type { UserDomainPermissions } from '../../../contexts/user/user.domain-permissions.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';

/** A guest holds no user-management permissions and can never edit an account. */
export class GuestUserVisa implements UserVisa {
	determineIf(predicate: (permissions: Readonly<UserDomainPermissions>) => boolean): boolean {
		return predicate({ canManageLearnerUsers: false, canManageStaffRolesAndPermissions: false, canManageStaffUsers: false, isEditingOwnAccount: false, isSystemAccount: false });
	}
}

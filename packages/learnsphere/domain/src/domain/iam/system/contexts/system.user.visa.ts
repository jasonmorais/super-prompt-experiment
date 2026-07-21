import type { UserDomainPermissions } from '../../../contexts/user/user.domain-permissions.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';

/** The system account holds full user-management permissions everywhere. */
export class SystemUserVisa implements UserVisa {
	determineIf(predicate: (permissions: Readonly<UserDomainPermissions>) => boolean): boolean {
		return predicate({ canManageLearnerUsers: true, canManageStaffRolesAndPermissions: true, canManageStaffUsers: true, isEditingOwnAccount: false, isSystemAccount: true });
	}
}

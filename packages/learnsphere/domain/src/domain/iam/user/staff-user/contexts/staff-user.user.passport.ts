import type { LearnerUserEntityReference } from '../../../../contexts/user/learner-user/learner-user.ts';
import type { StaffRoleEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';
import type { StaffUserEntityReference } from '../../../../contexts/user/staff-user/staff-user.ts';
import type { UserDomainPermissions } from '../../../../contexts/user/user.domain-permissions.ts';
import type { UserPassport } from '../../../../contexts/user/user.passport.ts';
import type { UserVisa } from '../../../../contexts/user/user.visa.ts';

/** Builds the user-domain visa from the authenticated staff user's persisted role. */
export class StaffUserUserPassport implements UserPassport {
	private readonly user: StaffUserEntityReference;
	constructor(user: StaffUserEntityReference) { this.user = user; }
	forLearnerUser(_root: LearnerUserEntityReference): UserVisa { return this.visa(); }
	forStaffUser(root: StaffUserEntityReference): UserVisa { return this.visa(root); }
	forStaffRole(_root: StaffRoleEntityReference): UserVisa { return this.visa(); }
	private visa(root?: StaffUserEntityReference): UserVisa {
		const role = this.user.role;
		const rolePermissions = role?.permissions;
		const permissions: UserDomainPermissions = {
			canManageLearnerUsers: false,
			canManageStaffRolesAndPermissions: (rolePermissions?.userPermissions.canAssignStaffRoles ?? false) || (rolePermissions?.staffRolePermissions.canEditRole ?? false),
			canManageStaffUsers: rolePermissions?.userPermissions.canManageUsers ?? false,
			isEditingOwnAccount: Boolean(root && root.externalId === this.user.externalId),
			isSystemAccount: false,
		};
		return { determineIf: (predicate) => predicate(permissions) };
	}
}

/** Permissions used by the user aggregates and their visas. */
export interface UserDomainPermissions {
	canManageLearnerUsers: boolean;
	canManageStaffRolesAndPermissions: boolean;
	canManageStaffUsers: boolean;
	isEditingOwnAccount: boolean;
	isSystemAccount: boolean;
}

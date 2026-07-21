import type { DeliveryPassport } from '../../../contexts/delivery/delivery.passport.ts';
import type { LearningPassport } from '../../../contexts/learning/learning.passport.ts';
import type { OperationsPassport } from '../../../contexts/operations/operations.passport.ts';
import type { OrganizationPassport } from '../../../contexts/organization/organization.passport.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../contexts/user/staff-role/staff-role.ts';
import type { StaffUserEntityReference } from '../../../contexts/user/staff-user/staff-user.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { Passport } from '../../../passport-factory.ts';
import { StaffUserDeliveryPassport } from './contexts/staff-user.delivery.passport.ts';
import { StaffUserLearningPassport } from './contexts/staff-user.learning.passport.ts';
import { StaffUserOperationsPassport } from './contexts/staff-user.operations.passport.ts';
import { StaffUserOrganizationPassport } from './contexts/staff-user.organization.passport.ts';
import { StaffUserUserPassport } from './contexts/staff-user.user.passport.ts';

/**
 * A staff user actor. Permissions are derived from the staff user's assigned
 * role (its "staff portal permissions") and scoped to the organizations the
 * staff user has been granted access to.
 */
export class StaffUserPassport implements Passport {
	readonly isGuest = false;
	readonly canViewTeamLearning: boolean;
	readonly canManageTeams: boolean;

	private readonly staffUser: StaffUserEntityReference;
	private readonly accessibleOrganizationIds: readonly string[];
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly canManageStaffRolesAndPermissions: boolean;
	private readonly canManageStaffUsers: boolean;

	constructor(staffUser: StaffUserEntityReference, accessibleOrganizationIds: readonly string[] = staffUser.organizationScopes.map((scope) => scope.organizationId)) {
		const role = staffUser.role;
		this.staffUser = staffUser;
		this.accessibleOrganizationIds = accessibleOrganizationIds;
		this.portal = role?.permissions.staffPortalPermissions;
		this.canManageTeams = role?.enterpriseAppRole === 'Staff.Manager' && (this.portal?.canManageTeams ?? false);
		this.canViewTeamLearning = this.portal?.canViewTeamLearning ?? false;
		this.canManageStaffRolesAndPermissions = (role?.permissions.userPermissions.canAssignStaffRoles ?? false) || (role?.permissions.staffRolePermissions.canEditRole ?? false);
		this.canManageStaffUsers = role?.permissions.userPermissions.canManageUsers ?? false;
	}

	canAccessOrganization(organizationId: string): boolean {
		return Boolean(organizationId && (this.accessibleOrganizationIds.includes('*') || this.accessibleOrganizationIds.includes(organizationId)));
	}

	private readonly inScope = (organizationId: string): boolean => this.accessibleOrganizationIds.includes(organizationId);

	private _userPassport: UserPassport | undefined;
	get user(): UserPassport {
		this._userPassport ??= new StaffUserUserPassport(this.staffUser, this.canManageStaffRolesAndPermissions, this.canManageStaffUsers);
		return this._userPassport;
	}

	private _learningPassport: LearningPassport | undefined;
	get learning(): LearningPassport {
		this._learningPassport ??= new StaffUserLearningPassport(this.portal, this.inScope);
		return this._learningPassport;
	}

	private _organizationPassport: OrganizationPassport | undefined;
	get organization(): OrganizationPassport {
		this._organizationPassport ??= new StaffUserOrganizationPassport(this.portal, this.inScope);
		return this._organizationPassport;
	}

	private _deliveryPassport: DeliveryPassport | undefined;
	get delivery(): DeliveryPassport {
		this._deliveryPassport ??= new StaffUserDeliveryPassport(this.portal, this.inScope);
		return this._deliveryPassport;
	}

	private _operationsPassport: OperationsPassport | undefined;
	get operations(): OperationsPassport {
		this._operationsPassport ??= new StaffUserOperationsPassport(this.portal, this.inScope);
		return this._operationsPassport;
	}
}

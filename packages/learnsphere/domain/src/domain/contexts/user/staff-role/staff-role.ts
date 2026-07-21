import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import { StaffRoleCreatedEvent, type StaffRoleCreatedProps } from '../../../events/types/staff-role-created.ts';
import type { Passport } from '../../passport.ts';
import type { UserVisa } from '../user.visa.ts';

export const StaffEnterpriseAppRoles = ['Staff.Manager', 'Staff.TeamLead'] as const;
/** Default role identifiers. Persisted staff roles may define additional identifiers. */
export type StaffEnterpriseAppRole = string;

export interface StaffPortalPermissionsProps {
	canViewTeamLearning: boolean;
	canManageCourses: boolean;
	canPublishCourses: boolean;
	canDeleteCourses: boolean;
	canManageTeams: boolean;
	canManageTeamOperations: boolean;
	canConfirmTeamOperations: boolean;
	canManageAssessments: boolean;
	canViewOrganization: boolean;
	canManageOrganizationStructure: boolean;
}
export type StaffPortalPermissionsEntityReference = Readonly<StaffPortalPermissionsProps>;

export interface StaffRoleUserPermissionsProps {
	canManageUsers: boolean;
	canAssignStaffRoles: boolean;
	canViewStaffUsers: boolean;
}
export type StaffRoleUserPermissionsEntityReference = Readonly<StaffRoleUserPermissionsProps>;
export interface StaffRoleRolePermissionsProps {
	canViewRoles: boolean;
	canAddRole: boolean;
	canEditRole: boolean;
	canRemoveRole: boolean;
}
export type StaffRoleRolePermissionsEntityReference = Readonly<StaffRoleRolePermissionsProps>;
export interface StaffRolePermissionsProps {
	staffPortalPermissions: StaffPortalPermissionsProps;
	userPermissions: StaffRoleUserPermissionsProps;
	staffRolePermissions: StaffRoleRolePermissionsProps;
}
export interface StaffRolePermissionsEntityReference {
	readonly staffPortalPermissions: StaffPortalPermissionsEntityReference;
	readonly userPermissions: StaffRoleUserPermissionsEntityReference;
	readonly staffRolePermissions: StaffRoleRolePermissionsEntityReference;
}

export interface StaffRoleProps extends DomainEntityProps {
	roleName: string;
	enterpriseAppRole: StaffEnterpriseAppRole;
	isDefault: boolean;
	permissions: StaffRolePermissionsProps;
	readonly roleType: string | null;
	readonly schemaVersion: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}
export type StaffRoleEntityReference = Readonly<Omit<StaffRoleProps, 'permissions'>> & { readonly permissions: StaffRolePermissionsEntityReference };

const emptyPortalPermissions = (): StaffPortalPermissionsProps => ({
	canViewTeamLearning: false,
	canManageCourses: false,
	canPublishCourses: false,
	canDeleteCourses: false,
	canManageTeams: false,
	canManageTeamOperations: false,
	canConfirmTeamOperations: false,
	canManageAssessments: false,
	canViewOrganization: false,
	canManageOrganizationStructure: false,
});
const emptyUserPermissions = (): StaffRoleUserPermissionsProps => ({ canManageUsers: false, canAssignStaffRoles: false, canViewStaffUsers: false });
const emptyRolePermissions = (): StaffRoleRolePermissionsProps => ({ canViewRoles: false, canAddRole: false, canEditRole: false, canRemoveRole: false });
export const emptyStaffRolePermissions = (): StaffRolePermissionsProps => ({ staffPortalPermissions: emptyPortalPermissions(), userPermissions: emptyUserPermissions(), staffRolePermissions: emptyRolePermissions() });

class PermissionGroup<T extends object> {
	private readonly props: T;
	private readonly visa: UserVisa;
	constructor(props: T, visa: UserVisa) {
		this.props = props;
		this.visa = visa;
	}
	protected get<K extends keyof T>(key: K): T[K] {
		return this.props[key];
	}
	protected set<K extends keyof T>(key: K, value: T[K]): void {
		if (!this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to update staff role permissions');
		(this.props as Record<K, T[K]>)[key] = value;
	}
}

export class StaffPortalPermissions extends PermissionGroup<StaffPortalPermissionsProps> implements StaffPortalPermissionsEntityReference {
	get canViewTeamLearning() {
		return this.get('canViewTeamLearning');
	}
	set canViewTeamLearning(v) {
		this.set('canViewTeamLearning', v);
	}
	get canManageCourses() {
		return this.get('canManageCourses');
	}
	set canManageCourses(v) {
		this.set('canManageCourses', v);
	}
	get canPublishCourses() {
		return this.get('canPublishCourses');
	}
	set canPublishCourses(v) {
		this.set('canPublishCourses', v);
	}
	get canDeleteCourses() {
		return this.get('canDeleteCourses');
	}
	set canDeleteCourses(v) {
		this.set('canDeleteCourses', v);
	}
	get canManageTeams() {
		return this.get('canManageTeams');
	}
	set canManageTeams(v) {
		this.set('canManageTeams', v);
	}
	get canManageTeamOperations() {
		return this.get('canManageTeamOperations');
	}
	set canManageTeamOperations(v) {
		this.set('canManageTeamOperations', v);
	}
	get canConfirmTeamOperations() {
		return this.get('canConfirmTeamOperations');
	}
	set canConfirmTeamOperations(v) {
		this.set('canConfirmTeamOperations', v);
	}
	get canManageAssessments() {
		return this.get('canManageAssessments');
	}
	set canManageAssessments(v) {
		this.set('canManageAssessments', v);
	}
	get canViewOrganization() {
		return this.get('canViewOrganization');
	}
	set canViewOrganization(v) {
		this.set('canViewOrganization', v);
	}
	get canManageOrganizationStructure() {
		return this.get('canManageOrganizationStructure');
	}
	set canManageOrganizationStructure(v) {
		this.set('canManageOrganizationStructure', v);
	}
}
export class StaffRoleUserPermissions extends PermissionGroup<StaffRoleUserPermissionsProps> implements StaffRoleUserPermissionsEntityReference {
	get canManageUsers() {
		return this.get('canManageUsers');
	}
	set canManageUsers(v) {
		this.set('canManageUsers', v);
	}
	get canAssignStaffRoles() {
		return this.get('canAssignStaffRoles');
	}
	set canAssignStaffRoles(v) {
		this.set('canAssignStaffRoles', v);
	}
	get canViewStaffUsers() {
		return this.get('canViewStaffUsers');
	}
	set canViewStaffUsers(v) {
		this.set('canViewStaffUsers', v);
	}
}
export class StaffRoleRolePermissions extends PermissionGroup<StaffRoleRolePermissionsProps> implements StaffRoleRolePermissionsEntityReference {
	get canViewRoles() {
		return this.get('canViewRoles');
	}
	set canViewRoles(v) {
		this.set('canViewRoles', v);
	}
	get canAddRole() {
		return this.get('canAddRole');
	}
	set canAddRole(v) {
		this.set('canAddRole', v);
	}
	get canEditRole() {
		return this.get('canEditRole');
	}
	set canEditRole(v) {
		this.set('canEditRole', v);
	}
	get canRemoveRole() {
		return this.get('canRemoveRole');
	}
	set canRemoveRole(v) {
		this.set('canRemoveRole', v);
	}
}
export class StaffRolePermissions implements StaffRolePermissionsEntityReference {
	private readonly props: StaffRolePermissionsProps;
	private readonly visa: UserVisa;
	constructor(props: StaffRolePermissionsProps, visa: UserVisa) {
		this.props = props;
		this.visa = visa;
	}
	get staffPortalPermissions() {
		return new StaffPortalPermissions(this.props.staffPortalPermissions, this.visa);
	}
	get userPermissions() {
		return new StaffRoleUserPermissions(this.props.userPermissions, this.visa);
	}
	get staffRolePermissions() {
		return new StaffRoleRolePermissions(this.props.staffRolePermissions, this.visa);
	}
}

export class StaffRole<props extends StaffRoleProps = StaffRoleProps> extends AggregateRoot<props, Passport> implements StaffRoleEntityReference {
	private isNew = false;
	private readonly visa: UserVisa;
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.user.forStaffRole(this);
	}
	static getNewInstance<props extends StaffRoleProps>(newProps: props, passport: Passport, roleName: string, isDefault = false): StaffRole<props> {
		const role = new StaffRole(newProps, passport);
		role.isNew = true;
		role.roleName = roleName;
		role.isDefault = isDefault;
		role.isNew = false;
		role.addIntegrationEvent<StaffRoleCreatedProps, StaffRoleCreatedEvent>(StaffRoleCreatedEvent, { staffRoleId: role.props.id, roleName: role.props.roleName });
		return role;
	}
	static getNewDefaultManagerInstance<props extends StaffRoleProps>(newProps: props, passport: Passport): StaffRole<props> {
		const role = StaffRole.getNewInstance(newProps, passport, 'Manager', true);
		role.enterpriseAppRole = 'Staff.Manager';
		role.props.permissions = {
			staffPortalPermissions: {
				canViewTeamLearning: true,
				canManageCourses: true,
				canPublishCourses: true,
				canDeleteCourses: true,
				canManageTeams: true,
				canManageTeamOperations: true,
				canConfirmTeamOperations: true,
				canManageAssessments: true,
				canViewOrganization: true,
				canManageOrganizationStructure: true,
			},
			userPermissions: { canManageUsers: true, canAssignStaffRoles: true, canViewStaffUsers: true },
			staffRolePermissions: { canViewRoles: true, canAddRole: false, canEditRole: false, canRemoveRole: false },
		};
		return role;
	}
	static getNewDefaultTeamLeadInstance<props extends StaffRoleProps>(newProps: props, passport: Passport): StaffRole<props> {
		const role = StaffRole.getNewInstance(newProps, passport, 'Team Lead', true);
		role.enterpriseAppRole = 'Staff.TeamLead';
		role.props.permissions = {
			staffPortalPermissions: {
				canViewTeamLearning: true,
				canManageCourses: false,
				canPublishCourses: false,
				canDeleteCourses: false,
				canManageTeams: false,
				canManageTeamOperations: true,
				canConfirmTeamOperations: false,
				canManageAssessments: false,
				canViewOrganization: true,
				canManageOrganizationStructure: false,
			},
			userPermissions: emptyUserPermissions(),
			staffRolePermissions: emptyRolePermissions(),
		};
		return role;
	}
	private validateManagement(): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to update staff roles');
	}
	override get id() {
		return this.props.id;
	}
	get roleName() {
		return this.props.roleName;
	}
	set roleName(value: string) {
		this.validateManagement();
		this.props.roleName = value.trim();
	}
	get enterpriseAppRole() {
		return this.props.enterpriseAppRole;
	}
	set enterpriseAppRole(value: StaffEnterpriseAppRole) {
		this.validateManagement();
		if (value !== 'Staff.Manager' && this.props.permissions.staffPortalPermissions.canManageTeams) throw new PermissionError('Only the Manager role can manage teams');
		this.props.enterpriseAppRole = value.trim();
	}
	get isDefault() {
		return this.props.isDefault;
	}
	set isDefault(value: boolean) {
		this.validateManagement();
		this.props.isDefault = value;
	}
	get permissions() {
		return new StaffRolePermissions(this.props.permissions, this.visa);
	}
	updatePermissions(value: Partial<{ [K in keyof StaffRolePermissionsProps]: Partial<StaffRolePermissionsProps[K]> }>): void {
		this.validateManagement();
		const permissions = {
			staffPortalPermissions: { ...this.props.permissions.staffPortalPermissions, ...(value.staffPortalPermissions ?? {}) },
			userPermissions: { ...this.props.permissions.userPermissions, ...(value.userPermissions ?? {}) },
			staffRolePermissions: { ...this.props.permissions.staffRolePermissions, ...(value.staffRolePermissions ?? {}) },
		};
		if (permissions.staffPortalPermissions.canManageTeams && this.props.enterpriseAppRole !== 'Staff.Manager') throw new PermissionError('Only the Manager role can manage teams');
		this.props.permissions = permissions;
	}
	get roleType() {
		return this.props.roleType;
	}
	get schemaVersion() {
		return this.props.schemaVersion;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
}

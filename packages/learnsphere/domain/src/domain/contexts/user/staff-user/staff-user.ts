import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { PropArray } from '@cellix/domain-seedwork/prop-array';
import type { Passport } from '../../passport.ts';
import { StaffRole, type StaffRoleEntityReference, type StaffRoleProps } from '../staff-role/staff-role.ts';
import type { UserVisa } from '../user.visa.ts';

export type StaffUserActivityType = 'CREATED' | 'UPDATED' | 'ROLE_ASSIGNED' | 'ROLE_REMOVED' | 'BLOCKED' | 'UNBLOCKED';
export interface StaffUserActivityLogProps extends DomainEntityProps { activityType: StaffUserActivityType; activityDescription: string; activityByStaffUserId: string; readonly createdAt: Date; readonly updatedAt: Date; }
export type StaffUserActivityLogEntityReference = Readonly<StaffUserActivityLogProps>;

export interface StaffUserProps extends DomainEntityProps {
	readonly role: StaffRoleProps | undefined;
	setRoleRef: (role: StaffRoleEntityReference | undefined) => void;
	firstName: string;
	lastName: string;
	email: string;
	displayName: string;
	externalId: string;
	accessBlocked: boolean;
	tags: string[];
	readonly userType: string;
	readonly schemaVersion: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	activityLog: PropArray<StaffUserActivityLogProps>;
}
export interface StaffUserEntityReference extends Readonly<Omit<StaffUserProps, 'role' | 'setRoleRef' | 'activityLog'>> { readonly role: StaffRoleEntityReference | undefined; readonly activityLog: ReadonlyArray<StaffUserActivityLogEntityReference>; }

export class StaffUser<props extends StaffUserProps = StaffUserProps> extends AggregateRoot<props, Passport> implements StaffUserEntityReference {
	private isNew = false;
	private readonly visa: UserVisa;
	constructor(props: props, passport: Passport) { super(props, passport); this.visa = passport.user.forStaffUser(this); }

	static getNewUser<props extends StaffUserProps>(newProps: props, passport: Passport, externalId: string, firstName: string, lastName: string, email: string): StaffUser<props> {
		const user = new StaffUser(newProps, passport); user.isNew = true; user.externalId = externalId; user.firstName = firstName; user.lastName = lastName; user.email = email; user.displayName = `${firstName} ${lastName}`.trim(); user.accessBlocked = false; user.tags = []; user.isNew = false; return user;
	}

	private validateManagement(): void { if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to update staff users'); }
	requestCreate(activityByStaffUserId: string): void { this.addActivity('CREATED', 'Staff user created', activityByStaffUserId); }
	requestRoleAssignment(role: StaffRoleEntityReference, activityByStaffUserId: string): void { this.role = role; this.addActivity('ROLE_ASSIGNED', `${role.roleName} assigned`, activityByStaffUserId); }
	requestRoleRemoval(activityByStaffUserId: string): void { this.role = undefined; this.addActivity('ROLE_REMOVED', 'Staff role removed', activityByStaffUserId); }
	requestBlock(activityByStaffUserId: string): void { this.accessBlocked = true; this.addActivity('BLOCKED', 'Staff user blocked', activityByStaffUserId); }
	requestUnblock(activityByStaffUserId: string): void { this.accessBlocked = false; this.addActivity('UNBLOCKED', 'Staff user unblocked', activityByStaffUserId); }
	private addActivity(activityType: StaffUserActivityType, activityDescription: string, activityByStaffUserId: string): void { const props = this.props.activityLog.getNewItem(); props.activityType = activityType; props.activityDescription = activityDescription; props.activityByStaffUserId = activityByStaffUserId; }

	override get id() { return this.props.id; }
	get role() { return this.props.role ? new StaffRole(this.props.role, this.passport) : undefined; }
	private set role(value: StaffRoleEntityReference | undefined) { this.validateManagement(); this.props.setRoleRef(value); }
	get firstName() { return this.props.firstName; }
	set firstName(value: string) { this.validateManagement(); this.props.firstName = value.trim(); }
	get lastName() { return this.props.lastName; }
	set lastName(value: string) { this.validateManagement(); this.props.lastName = value.trim(); }
	get email() { return this.props.email; }
	set email(value: string) { this.validateManagement(); this.props.email = value.trim(); }
	get displayName() { return this.props.displayName; }
	set displayName(value: string) { this.validateManagement(); this.props.displayName = value.trim(); }
	get externalId() { return this.props.externalId; }
	set externalId(value: string) { if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to change staff identity'); this.props.externalId = value.trim(); }
	get accessBlocked() { return this.props.accessBlocked; }
	set accessBlocked(value: boolean) { this.validateManagement(); this.props.accessBlocked = value; }
	get tags() { return [...this.props.tags]; }
	set tags(value: string[]) { this.validateManagement(); this.props.tags = [...value]; }
	get activityLog() { return this.props.activityLog.items.map((item) => ({ ...item })); }
	get userType() { return this.props.userType; }
	get schemaVersion() { return this.props.schemaVersion; }
	get createdAt() { return this.props.createdAt; }
	get updatedAt() { return this.props.updatedAt; }
}

import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { StaffRole as StaffRoleDocument, StaffUser as StaffUserDocument, StaffUserActivityDetail } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
import { StaffRoleDomainAdapter } from '../staff-role/staff-role.domain-adapter.ts';

export class StaffUserDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<StaffUserDocument> implements Domain.Contexts.User.StaffUser.StaffUserProps {
	get role() {
		if (!this.doc.role || this.doc.role instanceof MongooseSeedwork.ObjectId) return undefined;
		return new StaffRoleDomainAdapter(this.doc.role as StaffRoleDocument);
	}
	setRoleRef(role: Domain.Contexts.User.StaffRole.StaffRoleEntityReference | undefined): void {
		this.doc.set('role', role?.id ? new MongooseSeedwork.ObjectId(role.id) : undefined);
	}
	get firstName() {
		return this.doc.firstName ?? '';
	}
	set firstName(value: string) {
		this.doc.firstName = value;
	}
	get lastName() {
		return this.doc.lastName ?? '';
	}
	set lastName(value: string) {
		this.doc.lastName = value;
	}
	get email() {
		return this.doc.email ?? '';
	}
	set email(value: string) {
		this.doc.email = value;
	}
	get displayName() {
		return this.doc.displayName ?? '';
	}
	set displayName(value: string) {
		this.doc.displayName = value;
	}
	get externalId() {
		return this.doc.externalId;
	}
	set externalId(value: string) {
		this.doc.externalId = value;
	}
	get accessBlocked() {
		return this.doc.accessBlocked ?? false;
	}
	set accessBlocked(value: boolean) {
		this.doc.accessBlocked = value;
	}
	get tags() {
		return this.doc.tags ?? [];
	}
	set tags(value: string[]) {
		this.doc.tags = value;
	}
	get userType() {
		return this.doc.userType ?? 'staff-user';
	}
	override get schemaVersion() {
		return this.doc.schemaVersion ?? '1.0.0';
	}
	override get createdAt() {
		return this.doc.createdAt as Date;
	}
	override get updatedAt() {
		return this.doc.updatedAt as Date;
	}
	get activityLog(): Domain.Contexts.User.StaffUser.StaffUserProps['activityLog'] {
		return new MongooseSeedwork.MongoosePropArray(this.doc.activityLog, StaffUserActivityLogDomainAdapter);
	}
	get organizationScopes() {
		return (this.doc.organizationScopes ?? []).map((scope) => ({ organizationId: scope.organizationId, includeDescendants: scope.includeDescendants }));
	}
	set organizationScopes(value) {
		this.doc.organizationScopes = value;
	}
}

class StaffUserActivityLogDomainAdapter implements Domain.Contexts.User.StaffUser.StaffUserActivityLogProps {
	public readonly doc: StaffUserActivityDetail;
	constructor(doc: StaffUserActivityDetail) {
		this.doc = doc;
	}
	get id() {
		return String(this.doc.id ?? '');
	}
	get activityType() {
		return this.doc.activityType as Domain.Contexts.User.StaffUser.StaffUserActivityType;
	}
	set activityType(value) {
		this.doc.activityType = value;
	}
	get activityDescription() {
		return this.doc.activityDescription;
	}
	set activityDescription(value: string) {
		this.doc.activityDescription = value;
	}
	get activityByStaffUserId() {
		return String(this.doc.activityBy);
	}
	set activityByStaffUserId(value: string) {
		this.doc.set('activityBy', new MongooseSeedwork.ObjectId(value));
	}
	get createdAt() {
		return this.doc.createdAt;
	}
	get updatedAt() {
		return this.doc.updatedAt;
	}
}

export class StaffUserConverter extends MongooseSeedwork.MongoTypeConverter<StaffUserDocument, StaffUserDomainAdapter, Domain.Passport, Domain.Contexts.User.StaffUser.StaffUser<StaffUserDomainAdapter>> {
	constructor() {
		super(StaffUserDomainAdapter, Domain.Contexts.User.StaffUser.StaffUser);
	}
}

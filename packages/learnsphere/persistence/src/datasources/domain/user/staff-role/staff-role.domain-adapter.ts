import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { StaffRole as StaffRoleDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';

export class StaffRoleConverter extends MongooseSeedwork.MongoTypeConverter<StaffRoleDocument, StaffRoleDomainAdapter, Domain.Passport, Domain.Contexts.User.StaffRole.StaffRole<StaffRoleDomainAdapter>> {
	constructor() { super(StaffRoleDomainAdapter, Domain.Contexts.User.StaffRole.StaffRole); }
}
export class StaffRoleDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<StaffRoleDocument> implements Domain.Contexts.User.StaffRole.StaffRoleProps {
	get roleName() { return this.doc.roleName; } set roleName(value: string) { this.doc.roleName = value; }
	get enterpriseAppRole(): Domain.Contexts.User.StaffRole.StaffEnterpriseAppRole { return this.doc.enterpriseAppRole as Domain.Contexts.User.StaffRole.StaffEnterpriseAppRole; } set enterpriseAppRole(value: Domain.Contexts.User.StaffRole.StaffEnterpriseAppRole) { this.doc.enterpriseAppRole = value as typeof this.doc.enterpriseAppRole; }
	get isDefault() { return this.doc.isDefault; } set isDefault(value: boolean) { this.doc.isDefault = value; }
	get permissions() { if (!this.doc.permissions) this.doc.set('permissions', {}); return this.doc.permissions; } set permissions(value) { this.doc.permissions = value; }
	get roleType() { return this.doc.roleType ?? null; }
	override get schemaVersion() { return this.doc.schemaVersion ?? '1.0.0'; }
	override get createdAt() { return this.doc.createdAt as Date; }
	override get updatedAt() { return this.doc.updatedAt as Date; }
}

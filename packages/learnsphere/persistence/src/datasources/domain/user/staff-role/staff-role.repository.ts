import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { StaffRole as StaffRoleDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
import type { StaffRoleDomainAdapter } from './staff-role.domain-adapter.ts';

export class StaffRoleRepository extends MongooseSeedwork.MongoRepositoryBase<StaffRoleDocument, StaffRoleDomainAdapter, Domain.Passport, Domain.Contexts.User.StaffRole.StaffRole<StaffRoleDomainAdapter>> implements Domain.Contexts.User.StaffRole.StaffRoleRepository<StaffRoleDomainAdapter> {
	async getById(id: string) { const doc = await this.model.findById(id).exec(); if (!doc) throw new Error(`StaffRole with id ${id} not found`); return this.typeConverter.toDomain(doc, this.passport); }
	async getByRoleName(roleName: string) { const doc = await this.model.findOne({ roleName }).exec(); if (!doc) throw new Error(`StaffRole with roleName ${roleName} not found`); return this.typeConverter.toDomain(doc, this.passport); }
	async getDefaultRoleByEnterpriseAppRole(enterpriseAppRole: string) { const doc = await this.model.findOne({ isDefault: true, enterpriseAppRole }).exec(); if (!doc) throw new Error(`Default StaffRole with enterpriseAppRole ${enterpriseAppRole} not found`); return this.typeConverter.toDomain(doc, this.passport); }
	getNewInstance(roleName: string) { return Promise.resolve(Domain.Contexts.User.StaffRole.StaffRole.getNewInstance(this.typeConverter.toAdapter(new this.model()), this.passport, roleName)); }
}

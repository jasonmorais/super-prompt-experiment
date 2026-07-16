import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { StaffUser as StaffUserDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
import type { StaffUserDomainAdapter } from './staff-user.domain-adapter.ts';

export class StaffUserRepository extends MongooseSeedwork.MongoRepositoryBase<StaffUserDocument, StaffUserDomainAdapter, Domain.Passport, Domain.Contexts.User.StaffUser.StaffUser<StaffUserDomainAdapter>> implements Domain.Contexts.User.StaffUser.StaffUserRepository<StaffUserDomainAdapter> {
	async getById(id: string) { const doc = await this.model.findById(id).populate('role').exec(); if (!doc) throw new Error(`StaffUser with id ${id} not found`); return this.typeConverter.toDomain(doc, this.passport); }
	async getByExternalId(externalId: string) { const doc = await this.model.findOne({ externalId }).populate('role').exec(); if (!doc) throw new Error(`StaffUser with externalId ${externalId} not found`); return this.typeConverter.toDomain(doc, this.passport); }
	getNewInstance(externalId: string, firstName: string, lastName: string, email: string) { const adapter = this.typeConverter.toAdapter(new this.model()); adapter.tags = []; adapter.accessBlocked = false; return Promise.resolve(Domain.Contexts.User.StaffUser.StaffUser.getNewUser<StaffUserDomainAdapter>(adapter, this.passport, externalId, firstName, lastName, email)); }
}

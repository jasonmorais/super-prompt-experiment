import { MongooseSeedwork } from '@cellix/mongoose-seedwork'; import type { Organization as OrganizationDocument } from '@learnsphere/data-sources-mongoose-models'; import { Domain } from '@learnsphere/domain';
export class OrganizationConverter extends MongooseSeedwork.MongoTypeConverter<OrganizationDocument, OrganizationDomainAdapter, Domain.Passport, Domain.Contexts.Organization.Organization<OrganizationDomainAdapter>> { constructor() { super(OrganizationDomainAdapter, Domain.Contexts.Organization.Organization); } }
export class OrganizationDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<OrganizationDocument> implements Domain.Contexts.Organization.OrganizationProps {
	get externalId() { return this.doc.externalId; } set externalId(value) { this.doc.externalId = value; }
	get name() { return this.doc.name; } set name(value) { this.doc.name = value; }
	get parentOrganizationId() { return this.doc.parentOrganizationId; } set parentOrganizationId(value) { this.doc.parentOrganizationId = value; }
	get ancestorOrganizationIds() { return this.doc.ancestorOrganizationIds; } set ancestorOrganizationIds(value) { this.doc.ancestorOrganizationIds = value; }
	get createdBy() { return this.doc.createdBy; } set createdBy(value) { this.doc.createdBy = value; }
}

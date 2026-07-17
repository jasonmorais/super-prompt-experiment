import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport-factory.ts';

export interface OrganizationProps extends DomainEntityProps { externalId: string; name: string; parentOrganizationId: string | null; ancestorOrganizationIds: string[]; createdBy: string; readonly createdAt: Date; readonly updatedAt: Date; readonly schemaVersion: string; }
export type OrganizationEntityReference = Readonly<OrganizationProps>;
const requiredText = (value: string, field: string, max: number) => { const normalized = value.trim(); if (!normalized) throw new Error(`${field} is required`); if (normalized.length > max) throw new Error(`${field} cannot exceed ${max} characters`); return normalized; };
export class Organization<Props extends OrganizationProps = OrganizationProps> extends AggregateRoot<Props, Passport> implements OrganizationEntityReference {
	private isNew = false;
	static getNewInstance<Props extends OrganizationProps>(props: Props, input: { externalId: string; name: string; parentOrganizationId: string | null; ancestorOrganizationIds: string[]; createdBy: string }, passport: Passport): Organization<Props> {
		const organization = new Organization(props, passport); organization.isNew = true; organization.props.externalId = requiredText(input.externalId, 'Organization ID', 100); organization.props.parentOrganizationId = input.parentOrganizationId; organization.props.ancestorOrganizationIds = [...input.ancestorOrganizationIds];
		if (!organization.visa.determineIf((permissions) => permissions.canManageOrganizationStructure || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to create organizations');
		organization.name = input.name; organization.props.createdBy = requiredText(input.createdBy, 'Creator', 180); organization.isNew = false; return organization;
	}
	private get visa() { return this.passport.organization.forOrganization(this); }
	get externalId() { return this.props.externalId; }
	get name() { return this.props.name; } set name(value: string) { if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageOrganizationStructure || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to update organizations'); this.props.name = requiredText(value, 'Organization name', 180); }
	get parentOrganizationId() { return this.props.parentOrganizationId; }
	get ancestorOrganizationIds() { return [...this.props.ancestorOrganizationIds]; }
	get createdBy() { return this.props.createdBy; }
	get createdAt() { return this.props.createdAt; }
	get updatedAt() { return this.props.updatedAt; }
	get schemaVersion() { return this.props.schemaVersion; }
}

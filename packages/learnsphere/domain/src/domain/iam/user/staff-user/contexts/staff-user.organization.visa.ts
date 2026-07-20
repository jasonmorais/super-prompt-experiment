import type { OrganizationDomainPermissions } from '../../../../contexts/organization/organization.domain-permissions.ts';
import type { OrganizationEntityReference } from '../../../../contexts/organization/organization.ts';
import type { OrganizationVisa } from '../../../../contexts/organization/organization.visa.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';

/** A staff user may view and manage organizations they're assigned to, per their role's portal permissions. */
export class StaffUserOrganizationVisa implements OrganizationVisa {
	private readonly organization: OrganizationEntityReference;
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly inScope: (organizationId: string) => boolean;

	constructor(organization: OrganizationEntityReference, portal: StaffPortalPermissionsEntityReference | undefined, inScope: (organizationId: string) => boolean) {
		this.organization = organization;
		this.portal = portal;
		this.inScope = inScope;
	}

	determineIf(predicate: (permissions: OrganizationDomainPermissions) => boolean): boolean {
		const inScope = this.inScope(this.organization.externalId);
		return predicate({
			canViewOrganization: inScope && (this.portal?.canViewOrganization ?? false),
			canManageOrganizationStructure: inScope && (this.portal?.canManageOrganizationStructure ?? false),
			isSystemAccount: false,
		});
	}
}

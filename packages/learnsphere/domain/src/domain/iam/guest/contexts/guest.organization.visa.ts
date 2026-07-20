import type { OrganizationDomainPermissions } from '../../../contexts/organization/organization.domain-permissions.ts';
import type { OrganizationVisa } from '../../../contexts/organization/organization.visa.ts';

/** A guest holds no organization permissions. */
export class GuestOrganizationVisa implements OrganizationVisa {
	determineIf(predicate: (permissions: OrganizationDomainPermissions) => boolean): boolean {
		return predicate({ canViewOrganization: false, canManageOrganizationStructure: false, isSystemAccount: false });
	}
}

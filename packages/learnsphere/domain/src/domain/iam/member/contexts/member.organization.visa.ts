import type { OrganizationDomainPermissions } from '../../../contexts/organization/organization.domain-permissions.ts';
import type { OrganizationVisa } from '../../../contexts/organization/organization.visa.ts';

/** A member never holds organization-management permissions. */
export class MemberOrganizationVisa implements OrganizationVisa {
	determineIf(predicate: (permissions: OrganizationDomainPermissions) => boolean): boolean {
		return predicate({ canViewOrganization: false, canManageOrganizationStructure: false, isSystemAccount: false });
	}
}

import type { OrganizationDomainPermissions } from '../../../contexts/organization/organization.domain-permissions.ts';
import type { OrganizationVisa } from '../../../contexts/organization/organization.visa.ts';

/** The system account holds full organization permissions everywhere. */
export class SystemOrganizationVisa implements OrganizationVisa {
	determineIf(predicate: (permissions: OrganizationDomainPermissions) => boolean): boolean {
		return predicate({ canViewOrganization: true, canManageOrganizationStructure: true, isSystemAccount: true });
	}
}

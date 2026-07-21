import type { OrganizationPassport } from '../../../../contexts/organization/organization.passport.ts';
import type { OrganizationEntityReference } from '../../../../contexts/organization/organization.ts';
import type { OrganizationVisa } from '../../../../contexts/organization/organization.visa.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';
import { StaffUserOrganizationVisa } from './staff-user.organization.visa.ts';

export class StaffUserOrganizationPassport implements OrganizationPassport {
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly inScope: (organizationId: string) => boolean;

	constructor(portal: StaffPortalPermissionsEntityReference | undefined, inScope: (organizationId: string) => boolean) {
		this.portal = portal;
		this.inScope = inScope;
	}

	forOrganization(organization: OrganizationEntityReference): OrganizationVisa {
		return new StaffUserOrganizationVisa(organization, this.portal, this.inScope);
	}
}

import type { OrganizationPassport } from '../../../contexts/organization/organization.passport.ts';
import type { OrganizationEntityReference } from '../../../contexts/organization/organization.ts';
import type { OrganizationVisa } from '../../../contexts/organization/organization.visa.ts';
import { GuestOrganizationVisa } from './guest.organization.visa.ts';

export class GuestOrganizationPassport implements OrganizationPassport {
	forOrganization(_organization: OrganizationEntityReference): OrganizationVisa {
		return new GuestOrganizationVisa();
	}
}

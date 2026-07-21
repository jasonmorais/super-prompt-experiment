import type { OrganizationPassport } from '../../../contexts/organization/organization.passport.ts';
import type { OrganizationEntityReference } from '../../../contexts/organization/organization.ts';
import type { OrganizationVisa } from '../../../contexts/organization/organization.visa.ts';
import { SystemOrganizationVisa } from './system.organization.visa.ts';

export class SystemOrganizationPassport implements OrganizationPassport {
	forOrganization(_organization: OrganizationEntityReference): OrganizationVisa {
		return new SystemOrganizationVisa();
	}
}

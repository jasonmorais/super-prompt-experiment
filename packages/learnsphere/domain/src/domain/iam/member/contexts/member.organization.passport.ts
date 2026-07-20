import type { OrganizationPassport } from '../../../contexts/organization/organization.passport.ts';
import type { OrganizationEntityReference } from '../../../contexts/organization/organization.ts';
import type { OrganizationVisa } from '../../../contexts/organization/organization.visa.ts';
import { MemberOrganizationVisa } from './member.organization.visa.ts';

export class MemberOrganizationPassport implements OrganizationPassport {
	forOrganization(_organization: OrganizationEntityReference): OrganizationVisa {
		return new MemberOrganizationVisa();
	}
}

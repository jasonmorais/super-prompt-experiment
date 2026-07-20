import type { OperationsPassport } from '../../../../contexts/operations/operations.passport.ts';
import type { TeamOperationEntityReference } from '../../../../contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationVisa } from '../../../../contexts/operations/team-operation/team-operation.visa.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';
import { StaffUserTeamOperationVisa } from './staff-user.team-operation.visa.ts';

export class StaffUserOperationsPassport implements OperationsPassport {
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly inScope: (organizationId: string) => boolean;

	constructor(portal: StaffPortalPermissionsEntityReference | undefined, inScope: (organizationId: string) => boolean) {
		this.portal = portal;
		this.inScope = inScope;
	}

	forTeamOperation(operation: TeamOperationEntityReference): TeamOperationVisa {
		return new StaffUserTeamOperationVisa(operation, this.portal, this.inScope);
	}
}

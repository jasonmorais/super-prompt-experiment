import type { TeamOperationDomainPermissions } from '../../../../contexts/operations/team-operation/team-operation.domain-permissions.ts';
import type { TeamOperationEntityReference } from '../../../../contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationVisa } from '../../../../contexts/operations/team-operation/team-operation.visa.ts';
import type { StaffPortalPermissionsEntityReference } from '../../../../contexts/user/staff-role/staff-role.ts';

/** A staff user may manage team operations in organizations they're assigned to, per their role's portal permissions. */
export class StaffUserTeamOperationVisa implements TeamOperationVisa {
	private readonly operation: TeamOperationEntityReference;
	private readonly portal: StaffPortalPermissionsEntityReference | undefined;
	private readonly inScope: (organizationId: string) => boolean;

	constructor(operation: TeamOperationEntityReference, portal: StaffPortalPermissionsEntityReference | undefined, inScope: (organizationId: string) => boolean) {
		this.operation = operation;
		this.portal = portal;
		this.inScope = inScope;
	}

	determineIf(predicate: (permissions: Readonly<TeamOperationDomainPermissions>) => boolean): boolean {
		if (!this.inScope(this.operation.organizationId)) {
			return predicate({ canManageTeamOperations: false, canUpdateAssignedOperations: false, canEditTeamOperations: false, canDiscussTeamOperations: false, canConfirmTeamOperations: false });
		}
		return predicate({
			canManageTeamOperations: this.portal?.canManageTeamOperations ?? false,
			canUpdateAssignedOperations: this.portal?.canManageTeamOperations ?? false,
			canEditTeamOperations: this.portal?.canManageTeamOperations ?? false,
			canDiscussTeamOperations: this.portal?.canManageTeamOperations ?? false,
			canConfirmTeamOperations: this.portal?.canConfirmTeamOperations ?? false,
		});
	}
}

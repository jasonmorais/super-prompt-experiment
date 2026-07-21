import type { TeamOperationDomainPermissions } from '../../../contexts/operations/team-operation/team-operation.domain-permissions.ts';
import type { TeamOperationVisa } from '../../../contexts/operations/team-operation/team-operation.visa.ts';

/** A guest holds no team-operation permissions. */
export class GuestTeamOperationVisa implements TeamOperationVisa {
	determineIf(predicate: (permissions: Readonly<TeamOperationDomainPermissions>) => boolean): boolean {
		return predicate({ canManageTeamOperations: false, canUpdateAssignedOperations: false, canEditTeamOperations: false, canDiscussTeamOperations: false, canConfirmTeamOperations: false });
	}
}

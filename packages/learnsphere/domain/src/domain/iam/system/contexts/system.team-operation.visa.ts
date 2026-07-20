import type { TeamOperationDomainPermissions } from '../../../contexts/operations/team-operation/team-operation.domain-permissions.ts';
import type { TeamOperationVisa } from '../../../contexts/operations/team-operation/team-operation.visa.ts';

/** The system account holds full team-operation permissions everywhere. */
export class SystemTeamOperationVisa implements TeamOperationVisa {
	determineIf(predicate: (permissions: Readonly<TeamOperationDomainPermissions>) => boolean): boolean {
		return predicate({ canManageTeamOperations: true, canUpdateAssignedOperations: true, canEditTeamOperations: true, canDiscussTeamOperations: true, canConfirmTeamOperations: true });
	}
}

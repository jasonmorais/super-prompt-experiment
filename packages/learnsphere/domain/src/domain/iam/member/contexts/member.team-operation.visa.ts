import type { TeamOperationDomainPermissions } from '../../../contexts/operations/team-operation/team-operation.domain-permissions.ts';
import type { TeamOperationEntityReference } from '../../../contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationVisa } from '../../../contexts/operations/team-operation/team-operation.visa.ts';

/** A member may only update, edit, and discuss team operations assigned to them. */
export class MemberTeamOperationVisa implements TeamOperationVisa {
	private readonly operation: TeamOperationEntityReference;
	private readonly learnerId: string;

	constructor(operation: TeamOperationEntityReference, learnerId: string) {
		this.operation = operation;
		this.learnerId = learnerId;
	}

	determineIf(predicate: (permissions: Readonly<TeamOperationDomainPermissions>) => boolean): boolean {
		const isAssignee = this.operation.assigneeId === this.learnerId;
		return predicate({ canManageTeamOperations: false, canUpdateAssignedOperations: isAssignee, canEditTeamOperations: isAssignee, canDiscussTeamOperations: isAssignee, canConfirmTeamOperations: false });
	}
}

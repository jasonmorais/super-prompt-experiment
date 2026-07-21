import type { OperationsPassport } from '../../../contexts/operations/operations.passport.ts';
import type { TeamOperationEntityReference } from '../../../contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationVisa } from '../../../contexts/operations/team-operation/team-operation.visa.ts';
import { MemberTeamOperationVisa } from './member.team-operation.visa.ts';

export class MemberOperationsPassport implements OperationsPassport {
	private readonly learnerId: string;

	constructor(learnerId: string) {
		this.learnerId = learnerId;
	}

	forTeamOperation(operation: TeamOperationEntityReference): TeamOperationVisa {
		return new MemberTeamOperationVisa(operation, this.learnerId);
	}
}

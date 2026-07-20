import type { OperationsPassport } from '../../../contexts/operations/operations.passport.ts';
import type { TeamOperationEntityReference } from '../../../contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationVisa } from '../../../contexts/operations/team-operation/team-operation.visa.ts';
import { GuestTeamOperationVisa } from './guest.team-operation.visa.ts';

export class GuestOperationsPassport implements OperationsPassport {
	forTeamOperation(_operation: TeamOperationEntityReference): TeamOperationVisa {
		return new GuestTeamOperationVisa();
	}
}

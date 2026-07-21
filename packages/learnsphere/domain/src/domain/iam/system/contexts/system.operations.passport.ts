import type { OperationsPassport } from '../../../contexts/operations/operations.passport.ts';
import type { TeamOperationEntityReference } from '../../../contexts/operations/team-operation/team-operation.ts';
import type { TeamOperationVisa } from '../../../contexts/operations/team-operation/team-operation.visa.ts';
import { SystemTeamOperationVisa } from './system.team-operation.visa.ts';

export class SystemOperationsPassport implements OperationsPassport {
	forTeamOperation(_operation: TeamOperationEntityReference): TeamOperationVisa {
		return new SystemTeamOperationVisa();
	}
}

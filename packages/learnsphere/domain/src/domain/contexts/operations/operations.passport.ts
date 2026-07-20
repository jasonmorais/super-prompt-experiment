import type { TeamOperationEntityReference } from './team-operation/team-operation.ts';
import type { TeamOperationVisa } from './team-operation/team-operation.visa.ts';
export interface OperationsPassport {
	forTeamOperation(operation: TeamOperationEntityReference): TeamOperationVisa;
}

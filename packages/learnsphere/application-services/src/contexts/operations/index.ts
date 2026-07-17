import type { DataSources } from '@learnsphere/persistence';
import { TeamOperation, type TeamOperationApplicationService } from './team-operation/index.ts';

export interface OperationsContextApplicationService { TeamOperation: TeamOperationApplicationService; }

export const Operations = (dataSources: DataSources, identity: { sub: string; email?: string; given_name?: string; family_name?: string }): OperationsContextApplicationService => ({ TeamOperation: TeamOperation(dataSources, identity) });

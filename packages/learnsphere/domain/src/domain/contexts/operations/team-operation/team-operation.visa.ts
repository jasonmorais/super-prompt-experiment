import type { TeamOperationDomainPermissions } from './team-operation.domain-permissions.ts';

export interface TeamOperationVisa {
	determineIf(predicate: (permissions: Readonly<TeamOperationDomainPermissions>) => boolean): boolean;
}

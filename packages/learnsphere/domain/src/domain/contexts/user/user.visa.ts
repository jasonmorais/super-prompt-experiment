import type { UserDomainPermissions } from './user.domain-permissions.ts';

export interface UserVisa {
	determineIf(predicate: (permissions: Readonly<UserDomainPermissions>) => boolean): boolean;
}

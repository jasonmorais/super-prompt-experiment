import type { CourseDomainPermissions } from '../../contexts/course/course.domain-permissions.ts';

export type PermissionsSpec = CourseDomainPermissions;

export abstract class SystemPassportBase {
	protected readonly permissions: Partial<PermissionsSpec>;
	constructor(permissions?: Partial<PermissionsSpec>) {
		this.permissions = permissions ?? {};
	}
}

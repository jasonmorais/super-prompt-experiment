import { GuestPassport, SystemPassport } from '../iam/index.ts';
import type { PermissionsSpec } from '../iam/system/system.passport-base.ts';
import type { CoursePassport } from './course/course.passport.ts';

/**
 * A passport authorizes what a caller may do within the domain. Mirrors the
 * Community context's `Passport`: one sub-passport per bounded context, each
 * able to issue aggregate-scoped visas. Concrete passports live under `../iam`.
 *
 * The scaffold ships guest and system passports. Add member/staff passports —
 * together with their `iam` implementations — as the authorization model grows.
 */
export interface Passport {
	get course(): CoursePassport;
}

export const PassportFactory = {
	// for users who are not logged in on any portal — denies all permissions
	forGuest(): Passport {
		return new GuestPassport();
	},

	// for internal/system callers — permissions are supplied explicitly
	forSystem(permissions?: Partial<PermissionsSpec>): Passport {
		return new SystemPassport(permissions);
	},
};

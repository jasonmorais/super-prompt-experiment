import type { Passport } from '../../../contexts/passport.ts';
import type { StaffUserEntityReference } from '../../../contexts/user/staff-user/staff-user.ts';
import { PassportFactory } from '../../../passport-factory.ts';

/** Staff portal passport. Its capability visas are derived from StaffUser.role. */
export class StaffUserPassport {
	private readonly passport: Passport;
	constructor(staffUser: StaffUserEntityReference) {
		this.passport = PassportFactory.forStaffUser(staffUser);
	}
	get user() { return this.passport.user; }
	get canManageTeams() { return this.passport.canManageTeams; }
	get canViewTeamLearning() { return this.passport.canViewTeamLearning; }
}

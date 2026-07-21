import type { LearnerUserEntityReference } from '../../../contexts/user/learner-user/learner-user.ts';
import type { StaffRoleEntityReference } from '../../../contexts/user/staff-role/staff-role.ts';
import type { StaffUserEntityReference } from '../../../contexts/user/staff-user/staff-user.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';
import { MemberUserVisa } from './member.user.visa.ts';

export class MemberUserPassport implements UserPassport {
	private readonly actorExternalId: string | undefined;

	constructor(actorExternalId: string | undefined) {
		this.actorExternalId = actorExternalId;
	}

	private isOwnAccount(rootExternalId: string): boolean {
		return Boolean(this.actorExternalId && rootExternalId === this.actorExternalId);
	}

	forLearnerUser(root: LearnerUserEntityReference): UserVisa {
		return new MemberUserVisa(this.isOwnAccount(root.externalId));
	}
	forStaffUser(root: StaffUserEntityReference): UserVisa {
		return new MemberUserVisa(this.isOwnAccount(root.externalId));
	}
	// A member's own-account status never carries over to staff-role visas.
	forStaffRole(_root: StaffRoleEntityReference): UserVisa {
		return new MemberUserVisa(this.actorExternalId !== undefined);
	}
}

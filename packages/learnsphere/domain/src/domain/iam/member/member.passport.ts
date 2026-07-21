import type { DeliveryPassport } from '../../contexts/delivery/delivery.passport.ts';
import type { LearningPassport } from '../../contexts/learning/learning.passport.ts';
import type { OperationsPassport } from '../../contexts/operations/operations.passport.ts';
import type { OrganizationPassport } from '../../contexts/organization/organization.passport.ts';
import type { LearnerUserEntityReference } from '../../contexts/user/learner-user/learner-user.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import type { Passport } from '../../passport-factory.ts';
import { MemberDeliveryPassport } from './contexts/member.delivery.passport.ts';
import { MemberLearningPassport } from './contexts/member.learning.passport.ts';
import { MemberOperationsPassport } from './contexts/member.operations.passport.ts';
import { MemberOrganizationPassport } from './contexts/member.organization.passport.ts';
import { MemberUserPassport } from './contexts/member.user.passport.ts';

/**
 * A member (learner) actor, either resolved from a raw external id before a
 * LearnerUser aggregate has been loaded, or from the fully loaded aggregate.
 * Use {@link MemberPassport.forLearner} / {@link MemberPassport.forLearnerUser}
 * rather than the constructor directly.
 */
export class MemberPassport implements Passport {
	readonly isGuest = false;
	readonly canViewTeamLearning = false;
	readonly canManageTeams = false;

	private readonly learnerId: string;
	private readonly organizationId: string | undefined;
	private readonly actorExternalId: string | undefined;

	private constructor(learnerId: string, organizationId: string | undefined, actorExternalId: string | undefined) {
		this.learnerId = learnerId;
		this.organizationId = organizationId;
		this.actorExternalId = actorExternalId;
	}

	static forLearner(learnerId: string, organizationId?: string): MemberPassport {
		return new MemberPassport(learnerId, organizationId, undefined);
	}

	static forLearnerUser(learnerUser: LearnerUserEntityReference, organizationId?: string): MemberPassport {
		return new MemberPassport(learnerUser.externalId, organizationId, learnerUser.externalId);
	}

	canAccessOrganization(candidateOrganizationId: string): boolean {
		return Boolean(candidateOrganizationId && this.organizationId === candidateOrganizationId);
	}

	private _userPassport: UserPassport | undefined;
	get user(): UserPassport {
		this._userPassport ??= new MemberUserPassport(this.actorExternalId);
		return this._userPassport;
	}

	private _learningPassport: LearningPassport | undefined;
	get learning(): LearningPassport {
		this._learningPassport ??= new MemberLearningPassport(this.organizationId);
		return this._learningPassport;
	}

	private _organizationPassport: OrganizationPassport | undefined;
	get organization(): OrganizationPassport {
		this._organizationPassport ??= new MemberOrganizationPassport();
		return this._organizationPassport;
	}

	private _deliveryPassport: DeliveryPassport | undefined;
	get delivery(): DeliveryPassport {
		this._deliveryPassport ??= new MemberDeliveryPassport(this.learnerId);
		return this._deliveryPassport;
	}

	private _operationsPassport: OperationsPassport | undefined;
	get operations(): OperationsPassport {
		this._operationsPassport ??= new MemberOperationsPassport(this.learnerId);
		return this._operationsPassport;
	}
}

import type { DeliveryPassport } from '../../contexts/delivery/delivery.passport.ts';
import type { LearningPassport } from '../../contexts/learning/learning.passport.ts';
import type { OperationsPassport } from '../../contexts/operations/operations.passport.ts';
import type { OrganizationPassport } from '../../contexts/organization/organization.passport.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import type { Passport } from '../../passport-factory.ts';
import { GuestDeliveryPassport } from './contexts/guest.delivery.passport.ts';
import { GuestLearningPassport } from './contexts/guest.learning.passport.ts';
import { GuestOperationsPassport } from './contexts/guest.operations.passport.ts';
import { GuestOrganizationPassport } from './contexts/guest.organization.passport.ts';
import { GuestUserPassport } from './contexts/guest.user.passport.ts';

/** An unauthenticated actor. Holds no permissions anywhere in the system. */
export class GuestPassport implements Passport {
	readonly isGuest = true;
	readonly canViewTeamLearning = false;
	readonly canManageTeams = false;

	canAccessOrganization(): boolean {
		return false;
	}

	private _userPassport: UserPassport | undefined;
	get user(): UserPassport {
		this._userPassport ??= new GuestUserPassport();
		return this._userPassport;
	}

	private _learningPassport: LearningPassport | undefined;
	get learning(): LearningPassport {
		this._learningPassport ??= new GuestLearningPassport();
		return this._learningPassport;
	}

	private _organizationPassport: OrganizationPassport | undefined;
	get organization(): OrganizationPassport {
		this._organizationPassport ??= new GuestOrganizationPassport();
		return this._organizationPassport;
	}

	private _deliveryPassport: DeliveryPassport | undefined;
	get delivery(): DeliveryPassport {
		this._deliveryPassport ??= new GuestDeliveryPassport();
		return this._deliveryPassport;
	}

	private _operationsPassport: OperationsPassport | undefined;
	get operations(): OperationsPassport {
		this._operationsPassport ??= new GuestOperationsPassport();
		return this._operationsPassport;
	}
}

import type { DeliveryPassport } from '../../contexts/delivery/delivery.passport.ts';
import type { LearningPassport } from '../../contexts/learning/learning.passport.ts';
import type { OperationsPassport } from '../../contexts/operations/operations.passport.ts';
import type { OrganizationPassport } from '../../contexts/organization/organization.passport.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import type { Passport } from '../../passport-factory.ts';
import { SystemDeliveryPassport } from './contexts/system.delivery.passport.ts';
import { SystemLearningPassport } from './contexts/system.learning.passport.ts';
import { SystemOperationsPassport } from './contexts/system.operations.passport.ts';
import { SystemOrganizationPassport } from './contexts/system.organization.passport.ts';
import { SystemUserPassport } from './contexts/system.user.passport.ts';

/** The trusted system actor used by background/integration workflows. Holds full permissions everywhere. */
export class SystemPassport implements Passport {
	readonly isGuest = false;
	readonly canViewTeamLearning = true;
	readonly canManageTeams = true;
	readonly canAccessOrganization = Boolean;

	private _userPassport: UserPassport | undefined;
	get user(): UserPassport {
		this._userPassport ??= new SystemUserPassport();
		return this._userPassport;
	}

	private _learningPassport: LearningPassport | undefined;
	get learning(): LearningPassport {
		this._learningPassport ??= new SystemLearningPassport();
		return this._learningPassport;
	}

	private _organizationPassport: OrganizationPassport | undefined;
	get organization(): OrganizationPassport {
		this._organizationPassport ??= new SystemOrganizationPassport();
		return this._organizationPassport;
	}

	private _deliveryPassport: DeliveryPassport | undefined;
	get delivery(): DeliveryPassport {
		this._deliveryPassport ??= new SystemDeliveryPassport();
		return this._deliveryPassport;
	}

	private _operationsPassport: OperationsPassport | undefined;
	get operations(): OperationsPassport {
		this._operationsPassport ??= new SystemOperationsPassport();
		return this._operationsPassport;
	}
}

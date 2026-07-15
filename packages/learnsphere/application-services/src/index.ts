import type { ApiContextSpec } from '@learnsphere/context-spec';
import { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { Delivery, type DeliveryContextApplicationService } from './contexts/delivery/index.ts';
import { Learning, type LearningContextApplicationService } from './contexts/learning/index.ts';
import { Operations, type OperationsContextApplicationService } from './contexts/operations/index.ts';
import { Teams, type TeamsApplicationService } from './contexts/teams.ts';

export type { AssignLearningCommand } from './contexts/delivery/learning-record/assign.ts';
export type { CourseCreateCommand } from './contexts/learning/course/create.ts';
export type { CourseUpdateCommand } from './contexts/learning/course/update.ts';
export type { CourseModuleCommand } from './contexts/learning/course/add-module.ts';

export interface VerifiedJwt {
	sub: string;
	email?: string;
	given_name?: string;
	family_name?: string;
	tid?: string;
	roles?: string[];
}

export interface VerifiedUser {
	verifiedJwt?: VerifiedJwt;
	openIdConfigKey?: string;
	hints?: PrincipalHints;
}

export type PrincipalHints = { organizationId?: string; learnerId?: string };

export interface ApplicationServices {
	get verifiedUser(): VerifiedUser | null;
	Learning: LearningContextApplicationService;
	Delivery: DeliveryContextApplicationService;
	Operations: OperationsContextApplicationService;
	Teams: TeamsApplicationService;
}

export interface AppServicesHost<S> {
	forRequest(rawAuthHeader?: string, hints?: PrincipalHints): Promise<S>;
}

export type ApplicationServicesFactory = AppServicesHost<ApplicationServices>;

const getIdentity = (verifiedJwt: VerifiedJwt | undefined): VerifiedJwt => verifiedJwt ?? { sub: 'anonymous' };

const getPassport = (verifiedJwt: VerifiedJwt | undefined): Domain.Passport => {
	if (!verifiedJwt) return Domain.PassportFactory.forGuest();
	const roles = verifiedJwt.roles ?? [];
	if (roles.includes('ManagerLearningAdmin') || (roles.includes('Manager') && roles.includes('LearningAdmin'))) return Domain.PassportFactory.forManagerLearningAdmin();
	if (roles.includes('LearningAdmin')) return Domain.PassportFactory.forLearningAdmin();
	if (roles.includes('Manager')) return Domain.PassportFactory.forManager();
	if (roles.includes('Instructor')) return Domain.PassportFactory.forInstructor();
	return Domain.PassportFactory.forLearner(verifiedJwt.sub);
};

export const buildApplicationServicesFactory = (context: ApiContextSpec): ApplicationServicesFactory => ({
	async forRequest(rawAuthHeader, hints) {
		const accessToken = rawAuthHeader?.replace(/^Bearer\s+/i, '').trim();
		const tokenValidationResult = accessToken ? await context.tokenValidationService.verifyJwt<VerifiedJwt>(accessToken) : null;
		const verifiedJwt = tokenValidationResult?.verifiedJwt;
		const identity = getIdentity(verifiedJwt);
		const passport = getPassport(verifiedJwt);
		const dataSources: DataSources = context.dataSourcesFactory.withPassport(passport);
		const verifiedUser: VerifiedUser | null = tokenValidationResult
			? { ...tokenValidationResult, ...(hints ? { hints } : {}) }
			: null;
		return {
			get verifiedUser() {
				return verifiedUser;
			},
			Learning: Learning(dataSources, identity.sub),
			Delivery: Delivery(dataSources, passport, identity),
			Operations: Operations(dataSources, passport, { sub: identity.sub, ...(identity.email ? { email: identity.email } : {}), ...(identity.given_name ? { given_name: identity.given_name } : {}), ...(identity.family_name ? { family_name: identity.family_name } : {}) }),
			Teams: Teams(dataSources, passport, identity),
		};
	},
});

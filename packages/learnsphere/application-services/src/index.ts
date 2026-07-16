import type { ApiContextSpec } from '@learnsphere/context-spec';
import { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';
import { Delivery, type DeliveryContextApplicationService } from './contexts/delivery/index.ts';
import { Learning, type LearningContextApplicationService } from './contexts/learning/index.ts';
import { Operations, type OperationsContextApplicationService } from './contexts/operations/index.ts';
import { Teams, type TeamsApplicationService } from './contexts/teams/index.ts';
import { User, type UserContextApplicationService } from './contexts/user/index.ts';

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
	staffUser?: Domain.Contexts.User.StaffUser.StaffUserEntityReference;
	learnerUser?: Domain.Contexts.User.LearnerUser.LearnerUserEntityReference;
}

export type PrincipalHints = { organizationId?: string; learnerId?: string };

export interface ApplicationServices {
	get verifiedUser(): VerifiedUser | null;
	Learning: LearningContextApplicationService;
	Delivery: DeliveryContextApplicationService;
	Operations: OperationsContextApplicationService;
	Teams: TeamsApplicationService;
	User: UserContextApplicationService;
}

export interface AppServicesHost<S> {
	forRequest(rawAuthHeader?: string, hints?: PrincipalHints): Promise<S>;
}

export type ApplicationServicesFactory = AppServicesHost<ApplicationServices>;

const getIdentity = (verifiedJwt: VerifiedJwt | undefined): VerifiedJwt => verifiedJwt ?? { sub: 'anonymous' };

export const buildApplicationServicesFactory = (context: ApiContextSpec): ApplicationServicesFactory => ({
	async forRequest(rawAuthHeader, hints) {
		const accessToken = rawAuthHeader?.replace(/^Bearer\s+/i, '').trim();
		const tokenValidationResult = accessToken ? await context.tokenValidationService.verifyJwt<VerifiedJwt>(accessToken) : null;
		const verifiedJwt = tokenValidationResult?.verifiedJwt;
		const identity = getIdentity(verifiedJwt);
		let passport = Domain.PassportFactory.forGuest();
		let staffUser: Domain.Contexts.User.StaffUser.StaffUserEntityReference | undefined;
		let learnerUser: Domain.Contexts.User.LearnerUser.LearnerUserEntityReference | undefined;
		if (tokenValidationResult?.openIdConfigKey === 'StaffPortal') {
			const systemDataSources = context.dataSourcesFactory.withSystemPassport();
			staffUser = await systemDataSources.readonlyDataSource.User.StaffUser.StaffUserReadRepo.getByExternalId(identity.sub) ?? undefined;
			if (staffUser) passport = Domain.PassportFactory.forStaffUser(staffUser);
		} else if (verifiedJwt) {
			const systemDataSources = context.dataSourcesFactory.withSystemPassport();
			learnerUser = await systemDataSources.readonlyDataSource.User.LearnerUser.LearnerUserReadRepo.getByExternalId(verifiedJwt.sub) ?? undefined;
			passport = learnerUser ? Domain.PassportFactory.forLearnerUser(learnerUser) : Domain.PassportFactory.forLearner(verifiedJwt.sub);
		}
		const dataSources: DataSources = context.dataSourcesFactory.withPassport(passport);
		const verifiedUser: VerifiedUser | null = tokenValidationResult
			? { ...tokenValidationResult, ...(hints ? { hints } : {}), ...(staffUser ? { staffUser } : {}), ...(learnerUser ? { learnerUser } : {}) }
			: null;
		return {
			get verifiedUser() {
				return verifiedUser;
			},
			Learning: Learning(dataSources, identity.sub),
			Delivery: Delivery(dataSources, passport, identity),
			Operations: Operations(dataSources, passport, { sub: identity.sub, ...(identity.email ? { email: identity.email } : {}), ...(identity.given_name ? { given_name: identity.given_name } : {}), ...(identity.family_name ? { family_name: identity.family_name } : {}) }),
			Teams: Teams(dataSources, passport, identity),
			User: User(dataSources, passport),
		};
	},
});

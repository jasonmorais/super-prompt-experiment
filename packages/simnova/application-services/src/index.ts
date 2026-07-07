import type { ApiContextSpec } from '@simnova/context-spec';
import { Domain } from '@simnova/domain';

/**
 * The request-scoped application services surface. Each bounded context adds its
 * own service here (e.g. `Community`, `User`). The blank scaffold exposes only
 * the verified user derived from the request's token.
 */
export interface ApplicationServices {
	get verifiedUser(): VerifiedUser | null;
}

export interface VerifiedJwt {
	sub: string;
	email?: string;
	given_name?: string;
	family_name?: string;
	roles?: string[];
}

export interface VerifiedUser {
	verifiedJwt?: VerifiedJwt | undefined;
	openIdConfigKey?: string | undefined;
	hints?: PrincipalHints | undefined;
}

export type PrincipalHints = {
	memberId: string | undefined;
	communityId: string | undefined;
};

export interface AppServicesHost<S> {
	forRequest(rawAuthHeader?: string, hints?: PrincipalHints): Promise<S>;
}

export type ApplicationServicesFactory = AppServicesHost<ApplicationServices>;

/**
 * Builds the application-services host from the infrastructure context.
 *
 * For each request it validates the bearer token, resolves a domain passport,
 * scopes the data sources to that passport, and assembles the per-request
 * application services. The blank scaffold resolves a guest passport only —
 * add member/staff resolution and your context services as the app grows.
 */
export const buildApplicationServicesFactory = (context: ApiContextSpec): ApplicationServicesFactory => {
	const forRequest = async (rawAuthHeader?: string, hints?: PrincipalHints): Promise<ApplicationServices> => {
		const accessToken = rawAuthHeader?.replace(/^Bearer\s+/i, '').trim();
		const tokenValidationResult = accessToken ? await context.tokenValidationService.verifyJwt<VerifiedJwt>(accessToken) : null;

		const passport = Domain.PassportFactory.forGuest();
		context.dataSourcesFactory.withPassport(passport);

		return {
			get verifiedUser(): VerifiedUser | null {
				return tokenValidationResult ? { ...tokenValidationResult, hints } : null;
			},
		};
	};

	return { forRequest };
};

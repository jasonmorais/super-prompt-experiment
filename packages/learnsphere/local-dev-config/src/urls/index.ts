import { buildPortlessUrl } from '@cellix/local-dev/urls';
import { getLearnSphereHostnames } from '../hostnames/index.ts';
import type { LearnSphereLocalDevOptions, LearnSphereUrls } from '../types.ts';

/**
 * Builds the full set of local URLs required by LearnSphere app wrapper
 * scripts.
 *
 * @param options - Optional environment and workspace-root overrides forwarded
 * to `getLearnSphereHostnames`.
 * @returns Portless HTTPS URLs for UI apps, API GraphQL, mock OIDC issuers,
 * JWKS endpoints, and docs.
 *
 * @example
 * ```ts
 * const urls = buildLearnSphereUrls();
 * process.env.VITE_COMMON_API_ENDPOINT = urls.apiGraphqlUrl;
 * ```
 */
export function buildLearnSphereUrls(options: LearnSphereLocalDevOptions = {}): LearnSphereUrls {
	const hostnames = getLearnSphereHostnames(options);

	return {
		uiPortalBaseUrl: buildPortlessUrl(hostnames.uiPortal),
		uiPortalRedirectUrl: buildPortlessUrl(hostnames.uiPortal, '/auth-redirect'),
		uiStaffBaseUrl: buildPortlessUrl(hostnames.uiStaff),
		uiStaffRedirectUrl: buildPortlessUrl(hostnames.uiStaff, '/auth-redirect'),
		apiGraphqlUrl: buildPortlessUrl(hostnames.api, '/api/graphql'),
		mockPortalAuthorityUrl: buildPortlessUrl(hostnames.mockAuth, '/portal-user'),
		mockPortalJwksUrl: buildPortlessUrl(hostnames.mockAuth, '/portal-user/.well-known/jwks.json'),
		mockStaffAuthorityUrl: buildPortlessUrl(hostnames.mockAuth, '/staff-user'),
		mockStaffJwksUrl: buildPortlessUrl(hostnames.mockAuth, '/staff-user/.well-known/jwks.json'),
		docsBaseUrl: buildPortlessUrl(hostnames.docs),
	};
}

export type { LearnSphereLocalDevOptions, LearnSphereUrls } from '../types.ts';

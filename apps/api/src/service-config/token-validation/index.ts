/**
 * Maps portal keys to their OIDC environment-variable prefixes. Each portal's
 * settings are read from `${PREFIX}_OIDC_ENDPOINT`, `_OIDC_AUDIENCE`,
 * `_OIDC_ISSUER`, and `_OIDC_IGNORE_ISSUER`. LearnSphere has learner and staff
 * portals. Each entry intentionally has its own audience and
 * JWKS because the local Cellix mock OIDC server signs each portal separately.
 */
export const portalTokens = new Map<string, string>([
	['LearnerPortal', 'PORTAL'],
	['StaffPortal', 'STAFF'],
]);

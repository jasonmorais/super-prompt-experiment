/**
 * Maps portal keys to their OIDC environment-variable prefixes. Each portal's
 * settings are read from `${PREFIX}_OIDC_ENDPOINT`, `_OIDC_AUDIENCE`,
 * `_OIDC_ISSUER`, and `_OIDC_IGNORE_ISSUER`. The blank scaffold ships a single
 * portal — add more entries here as you add portals.
 */
export const portalTokens = new Map<string, string>([['Portal', 'PORTAL']]);

/**
 * Options shared by LearnSphere local-development config helpers.
 */
export interface LearnSphereLocalDevOptions {
	/** Environment override source. Defaults to `process.env`. */
	env?: NodeJS.ProcessEnv;
	/** Workspace root to read app `.env` files from. Defaults to auto-discovery. */
	workspaceRoot?: string;
}

/**
 * Portless hostnames used by LearnSphere browser-facing apps and local HTTP
 * mocks.
 */
export interface LearnSphereHostnames {
	/** Portal (end-user) app hostname. */
	uiPortal: string;
	/** Staff portal hostname. */
	uiStaff: string;
	/** API hostname. */
	api: string;
	/** Mock authentication server hostname. */
	mockAuth: string;
	/** Documentation site hostname. */
	docs: string;
}

/**
 * Fully qualified local URLs consumed by LearnSphere app wrapper scripts.
 */
export interface LearnSphereUrls {
	/** Portal app base URL. */
	uiPortalBaseUrl: string;
	/** Portal app OIDC redirect URL. */
	uiPortalRedirectUrl: string;
	/** Staff portal base URL. */
	uiStaffBaseUrl: string;
	/** Staff portal OIDC redirect URL. */
	uiStaffRedirectUrl: string;
	/** API GraphQL endpoint URL. */
	apiGraphqlUrl: string;
	/** Portal OIDC issuer URL on the mock auth server. */
	mockPortalAuthorityUrl: string;
	/** Portal OIDC JWKS URL on the mock auth server. */
	mockPortalJwksUrl: string;
	/** Staff OIDC issuer URL on the mock auth server. */
	mockStaffAuthorityUrl: string;
	/** Staff OIDC JWKS URL on the mock auth server. */
	mockStaffJwksUrl: string;
	/** Documentation site base URL. */
	docsBaseUrl: string;
}

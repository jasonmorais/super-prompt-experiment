type OIDCConfig = {
	authority: string;
	client_id: string;
	redirect_uri: string;
	response_type: string;
	scope: string;
	onSigninCallback: () => void;
};

/**
 * OIDC configuration for the portal. Values come from `VITE_APP_UI_PORTAL_*`
 * environment variables, falling back to the local mock OAuth2 server
 * (`@apps/server-oauth2-mock`) for development.
 */
export const oidcConfig: OIDCConfig = {
	authority: import.meta.env.VITE_APP_UI_PORTAL_AUTHORITY ?? 'https://mock-auth.learnsphere.localhost:1355/portal',
	client_id: import.meta.env.VITE_APP_UI_PORTAL_CLIENTID ?? 'mock-client',
	redirect_uri: import.meta.env.VITE_APP_UI_PORTAL_REDIRECT_URI ?? 'https://learnsphere.localhost:1355/auth-redirect',
	response_type: 'code',
	scope: import.meta.env.VITE_APP_UI_PORTAL_SCOPES ?? 'openid',
	onSigninCallback: (): void => {
		globalThis.history.replaceState({}, document.title, globalThis.location.pathname);
	},
};

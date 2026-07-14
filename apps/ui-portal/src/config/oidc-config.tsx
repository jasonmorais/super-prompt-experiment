type OIDCConfig = {
	authority: string;
	client_id: string;
	redirect_uri: string;
	response_type: string;
	scope: string;
	code_verifier: boolean;
	nonce: boolean;
	onSigninCallback: () => void;
};

/**
 * OIDC configuration for the portal. Values come from `VITE_APP_UI_PORTAL_*`
 * environment variables, falling back to the local mock OAuth2 server
 * (`@apps/server-oauth2-mock`) for development.
 */
export const oidcConfig: OIDCConfig = {
	authority: import.meta.env.VITE_APP_UI_PORTAL_AUTHORITY ?? 'http://127.0.0.1:1355/portal-user',
	client_id: import.meta.env.VITE_APP_UI_PORTAL_CLIENTID ?? 'mock-client',
	redirect_uri: import.meta.env.VITE_APP_UI_PORTAL_REDIRECT_URI ?? 'http://localhost:3000/auth-redirect',
	response_type: 'code',
	scope: import.meta.env.VITE_APP_UI_PORTAL_SCOPES ?? 'openid',
	code_verifier: true,
	nonce: true,
	onSigninCallback: (): void => {
		const redirectTo = globalThis.sessionStorage.getItem('redirectTo') ?? '/dashboard';
		globalThis.sessionStorage.removeItem('redirectTo');
		globalThis.location.replace(redirectTo);
	},
};

export const oidcConfig = {
	authority: import.meta.env.VITE_APP_UI_STAFF_AUTHORITY ?? 'http://127.0.0.1:1355/staff-user',
	client_id: import.meta.env.VITE_APP_UI_STAFF_CLIENTID ?? 'mock-staff-client',
	redirect_uri: import.meta.env.VITE_APP_UI_STAFF_REDIRECT_URI ?? 'http://localhost:3002/auth-redirect',
	response_type: 'code',
	scope: import.meta.env.VITE_APP_UI_STAFF_SCOPES ?? 'openid',
	code_verifier: true,
	nonce: true,
	onSigninCallback: () => {
		const redirectTo = globalThis.sessionStorage.getItem('staffRedirectTo') ?? '/staff';
		globalThis.sessionStorage.removeItem('staffRedirectTo');
		globalThis.location.replace(redirectTo);
	},
};

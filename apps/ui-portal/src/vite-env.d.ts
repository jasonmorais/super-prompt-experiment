/// <reference types="vite/client" />
/// <reference types="@simnova/ui-shared/env" />

interface ImportMetaEnv {
	readonly VITE_APP_UI_PORTAL_AUTHORITY?: string;
	readonly VITE_APP_UI_PORTAL_CLIENTID?: string;
	readonly VITE_APP_UI_PORTAL_REDIRECT_URI?: string;
	readonly VITE_APP_UI_PORTAL_SCOPES?: string;
}

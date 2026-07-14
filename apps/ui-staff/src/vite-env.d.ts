/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_COMMON_API_ENDPOINT?: string;
	readonly VITE_APP_UI_STAFF_AUTHORITY?: string;
	readonly VITE_APP_UI_STAFF_CLIENTID?: string;
	readonly VITE_APP_UI_STAFF_REDIRECT_URI?: string;
	readonly VITE_APP_UI_STAFF_SCOPES?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

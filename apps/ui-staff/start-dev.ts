import { ViteDevRunner } from '@cellix/local-dev';
import { buildLearnSphereUrls } from '@learnsphere/local-dev-config';

const urls = buildLearnSphereUrls();

new ViteDevRunner({
	settings: {
		VITE_APP_UI_STAFF_AUTHORITY: urls.mockStaffAuthorityUrl,
		VITE_APP_UI_STAFF_REDIRECT_URI: urls.uiStaffRedirectUrl,
		VITE_APP_UI_STAFF_BASE_URL: urls.uiStaffBaseUrl,
		VITE_COMMON_API_ENDPOINT: urls.apiGraphqlUrl,
	},
}).start();

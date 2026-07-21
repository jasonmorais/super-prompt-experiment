import { ViteDevRunner } from '@cellix/local-dev';
import { buildLearnSphereUrls } from '@learnsphere/local-dev-config';

const urls = buildLearnSphereUrls();

new ViteDevRunner({
	settings: {
		VITE_APP_UI_PORTAL_AUTHORITY: urls.mockPortalAuthorityUrl,
		VITE_APP_UI_PORTAL_REDIRECT_URI: urls.uiPortalRedirectUrl,
		VITE_COMMON_API_ENDPOINT: urls.apiGraphqlUrl,
		VITE_APP_UI_PORTAL_BASE_URL: urls.uiPortalBaseUrl,
	},
}).start();

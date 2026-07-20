import { NodeDevRunner } from '@cellix/local-dev';
import { buildLearnSphereUrls } from '@learnsphere/local-dev-config';

const urls = buildLearnSphereUrls();
const mockAuthBaseUrl = new URL(urls.mockPortalAuthorityUrl).origin;

new NodeDevRunner({
	settings: {
		BASE_URL: mockAuthBaseUrl,
		VITE_APP_UI_PORTAL_REDIRECT_URI: urls.uiPortalRedirectUrl,
		VITE_APP_UI_STAFF_REDIRECT_URI: urls.uiStaffRedirectUrl,
	},
}).start();

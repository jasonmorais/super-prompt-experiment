# @learnsphere/local-dev-config

LearnSphere-specific local-development URL and hostname helpers built on `@cellix/local-dev`.

This package owns LearnSphere application policy: which app `.env` files define local hostnames, which auth issuer paths are used, and which URLs app wrapper scripts should inject. Generic mechanics such as dotenv parsing, portless URL construction, and worktree-safe hostname suffixing stay in `@cellix/local-dev`.

## Install

```json
{
	"devDependencies": {
		"@learnsphere/local-dev-config": "workspace:*"
	}
}
```

## Usage

Use this package as the LearnSphere source of local URLs, then pass those values into the generic Cellix worktree runners:

```ts
import { ViteDevRunner } from '@cellix/local-dev';
import { buildLearnSphereUrls } from '@learnsphere/local-dev-config';

const urls = buildLearnSphereUrls();

new ViteDevRunner({
	settings: {
		VITE_APP_UI_PORTAL_BASE_URL: urls.uiPortalBaseUrl,
		VITE_COMMON_API_ENDPOINT: urls.apiGraphqlUrl,
	},
}).start();
```

## Public API

All exports are available from `@learnsphere/local-dev-config`. Focused subpaths are
also published for narrower imports:

- `@learnsphere/local-dev-config/hostnames`
- `@learnsphere/local-dev-config/urls`

- `getLearnSphereHostnames(options?)`
- `buildLearnSphereUrls(options?)`
- `buildLearnSphereApiLocalSettings(options?)`
- `LearnSphereLocalDevOptions`
- `LearnSphereHostnames`
- `LearnSphereUrls`

## Boundaries

- Keep reusable process runners, dotenv parsing, JSON syncing, and port math in `@cellix/local-dev`.
- Keep LearnSphere-specific hostname derivation, auth paths, redirect paths, and app `.env` lookup policy here.
- Keep one-off runtime behavior in the consuming app wrapper script instead of widening this package.
- Keep app wrapper scripts thin: get LearnSphere URL values here, pass them into a generic `@cellix/local-dev` worktree object, and call `start()` or `sync()`.

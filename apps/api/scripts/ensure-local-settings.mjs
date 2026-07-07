import { copyFileSync, existsSync } from 'node:fs';

// Local dev settings for the Azure Functions host.
//
// 1. Seed a developer-editable `local.settings.json` (gitignored) from the
//    committed `local.settings.json.example`, if it does not already exist.
// 2. Mirror it into the deploy script-root (`deploy/`) — which is where
//    `func start --script-root deploy/` actually reads settings from.
//
// Runs in `predev` / `prestart`, AFTER `prepare:deploy` has built the deploy bundle.
if (!existsSync('local.settings.json')) {
	copyFileSync('local.settings.json.example', 'local.settings.json');
	console.log('Created apps/api/local.settings.json from local.settings.json.example');
}

if (existsSync('deploy')) {
	copyFileSync('local.settings.json', 'deploy/local.settings.json');
}

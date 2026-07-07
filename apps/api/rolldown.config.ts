/**
 * Rolldown bundler configuration for @apps/api.
 *
 * Bundles the TypeScript-compiled output (dist/index.js) — including all
 * workspace and npm dependencies — into a single optimised ESM file at
 * deploy/dist/index.js used for local development and CI/CD deployment.
 */
/// <reference types="node" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCellixAzureFunctionsRolldownConfig } from '@cellix/config-rolldown';
import { defineConfig } from 'rolldown';

const apiDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(apiDir, '../..');

export default defineConfig(async () =>
	createCellixAzureFunctionsRolldownConfig({
		repoRoot,
		appPackageName: '@apps/api',
		applicationNamespaces: ['@simnova/'],
	}),
);

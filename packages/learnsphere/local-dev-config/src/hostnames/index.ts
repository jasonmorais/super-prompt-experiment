import path from 'node:path';
import { type DotEnvValues, readDotEnv } from '@cellix/local-dev/files';
import { applyWorktreeSuffix, hostnameFromUrl } from '@cellix/local-dev/urls';
import { resolveWorkspaceRoot } from '@cellix/local-dev/workspace';
import type { LearnSphereHostnames, LearnSphereLocalDevOptions } from '../types.ts';

interface LearnSphereEnvValues {
	WORKTREE_NAME?: string;
	VITE_APP_UI_PORTAL_BASE_URL?: string;
	VITE_COMMON_API_ENDPOINT?: string;
	VITE_APP_UI_PORTAL_AUTHORITY?: string;
	VITE_APP_UI_STAFF_BASE_URL?: string;
	VITE_APP_UI_STAFF_AUTHORITY?: string;
}

function requiredHostname(url: string, key: string): string {
	const hostname = hostnameFromUrl(url);
	if (!hostname) {
		throw new Error(`[learnsphere-local-dev] Missing or invalid URL for ${key}`);
	}

	return hostname;
}

function readAppEnv(workspaceRoot: string, appName: string): DotEnvValues & LearnSphereEnvValues {
	return readDotEnv(path.join(workspaceRoot, 'apps', appName, '.env')) as DotEnvValues & LearnSphereEnvValues;
}

function firstDefinedUrl(...values: Array<string | undefined>): string {
	return values.find((value) => value !== undefined) ?? '';
}

function requiredHostnameFromSources(key: string, ...values: Array<string | undefined>): string {
	return requiredHostname(firstDefinedUrl(...values), key);
}

/**
 * Resolves the LearnSphere local-development hostnames from app `.env` files
 * and optional process environment overrides.
 *
 * The package keeps LearnSphere-specific policy here: which app env files to
 * read, which env keys define the public local hostnames, and how the
 * documentation hostname is derived. Generic URL parsing and worktree
 * suffixing remain in `@cellix/local-dev`.
 *
 * @param options - Optional environment and workspace-root overrides.
 * @returns Worktree-aware LearnSphere hostnames.
 * @throws When a required URL cannot be found or parsed.
 *
 * @example
 * ```ts
 * const hostnames = getLearnSphereHostnames({
 *   env: { WORKTREE_NAME: 'jason/feature' },
 *   workspaceRoot,
 * });
 * ```
 */
export function getLearnSphereHostnames(options: LearnSphereLocalDevOptions = {}): LearnSphereHostnames {
	const env = (options.env ?? process.env) as NodeJS.ProcessEnv & LearnSphereEnvValues;
	const workspaceRoot = options.workspaceRoot ?? resolveWorkspaceRoot();
	const portalEnv = readAppEnv(workspaceRoot, 'ui-portal');
	const staffEnv = readAppEnv(workspaceRoot, 'ui-staff');
	const worktreeName = env.WORKTREE_NAME;
	const portalHostname = requiredHostnameFromSources('VITE_APP_UI_PORTAL_BASE_URL', env.VITE_APP_UI_PORTAL_BASE_URL, portalEnv.VITE_APP_UI_PORTAL_BASE_URL);
	const apiHostname = requiredHostnameFromSources('VITE_COMMON_API_ENDPOINT', env.VITE_COMMON_API_ENDPOINT, portalEnv.VITE_COMMON_API_ENDPOINT);
	const mockAuthHostname = requiredHostnameFromSources(
		'VITE_APP_UI_PORTAL_AUTHORITY',
		env.VITE_APP_UI_PORTAL_AUTHORITY,
		portalEnv.VITE_APP_UI_PORTAL_AUTHORITY,
		env.VITE_APP_UI_STAFF_AUTHORITY,
		staffEnv.VITE_APP_UI_STAFF_AUTHORITY,
	);
	const staffHostname = requiredHostnameFromSources('VITE_APP_UI_STAFF_BASE_URL', env.VITE_APP_UI_STAFF_BASE_URL, staffEnv.VITE_APP_UI_STAFF_BASE_URL);

	return {
		uiPortal: applyWorktreeSuffix(portalHostname, worktreeName),
		uiStaff: applyWorktreeSuffix(staffHostname, worktreeName),
		api: applyWorktreeSuffix(apiHostname, worktreeName),
		mockAuth: applyWorktreeSuffix(mockAuthHostname, worktreeName),
		docs: applyWorktreeSuffix(`docs.${portalHostname}`, worktreeName),
	};
}

export type { LearnSphereHostnames, LearnSphereLocalDevOptions } from '../types.ts';

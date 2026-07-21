import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildLearnSphereUrls, getLearnSphereHostnames } from '@learnsphere/local-dev-config';
import { describe, expect, it } from 'vitest';

function createWorkspaceFixture(): string {
	const workspaceRoot = mkdtempSync(path.join(tmpdir(), 'learnsphere-local-dev-config-'));
	writeFileSync(path.join(workspaceRoot, 'pnpm-workspace.yaml'), 'packages:\n  - "apps/*"\n');
	mkdirSync(path.join(workspaceRoot, 'apps', 'ui-portal'), { recursive: true });
	mkdirSync(path.join(workspaceRoot, 'apps', 'ui-staff'), { recursive: true });
	writeFileSync(
		path.join(workspaceRoot, 'apps', 'ui-portal', '.env'),
		[
			'VITE_APP_UI_PORTAL_BASE_URL=https://learnsphere.localhost:1355',
			'VITE_COMMON_API_ENDPOINT=https://data-access.learnsphere.localhost:1355/api/graphql',
			'VITE_APP_UI_PORTAL_AUTHORITY=https://mock-auth.learnsphere.localhost:1355/portal-user',
		].join('\n'),
	);
	writeFileSync(
		path.join(workspaceRoot, 'apps', 'ui-staff', '.env'),
		[
			'VITE_APP_UI_STAFF_BASE_URL=https://staff.learnsphere.localhost:1355',
			'VITE_APP_UI_STAFF_AUTHORITY=https://mock-auth.learnsphere.localhost:1355/staff-user',
		].join('\n'),
	);

	return workspaceRoot;
}

describe('@learnsphere/local-dev-config', () => {
	it('resolves LearnSphere hostnames from app env files and applies a safe worktree suffix', () => {
		const workspaceRoot = createWorkspaceFixture();

		expect(
			getLearnSphereHostnames({
				env: { WORKTREE_NAME: 'Jason/Feature 123' },
				workspaceRoot,
			}),
		).toEqual({
			uiPortal: 'learnsphere.jason-feature-123.localhost',
			uiStaff: 'staff.learnsphere.jason-feature-123.localhost',
			api: 'data-access.learnsphere.jason-feature-123.localhost',
			mockAuth: 'mock-auth.learnsphere.jason-feature-123.localhost',
			docs: 'docs.learnsphere.jason-feature-123.localhost',
		});
	});

	it('builds the complete LearnSphere local URL set for app wrapper scripts', () => {
		const workspaceRoot = createWorkspaceFixture();

		expect(buildLearnSphereUrls({ env: {}, workspaceRoot })).toEqual({
			uiPortalBaseUrl: 'https://learnsphere.localhost:1355',
			uiPortalRedirectUrl: 'https://learnsphere.localhost:1355/auth-redirect',
			uiStaffBaseUrl: 'https://staff.learnsphere.localhost:1355',
			uiStaffRedirectUrl: 'https://staff.learnsphere.localhost:1355/auth-redirect',
			apiGraphqlUrl: 'https://data-access.learnsphere.localhost:1355/api/graphql',
			mockPortalAuthorityUrl: 'https://mock-auth.learnsphere.localhost:1355/portal-user',
			mockPortalJwksUrl: 'https://mock-auth.learnsphere.localhost:1355/portal-user/.well-known/jwks.json',
			mockStaffAuthorityUrl: 'https://mock-auth.learnsphere.localhost:1355/staff-user',
			mockStaffJwksUrl: 'https://mock-auth.learnsphere.localhost:1355/staff-user/.well-known/jwks.json',
			docsBaseUrl: 'https://docs.learnsphere.localhost:1355',
		});
	});

	it('lets environment values override app env files', () => {
		const workspaceRoot = createWorkspaceFixture();

		expect(
			getLearnSphereHostnames({
				env: {
					VITE_APP_UI_PORTAL_BASE_URL: 'https://portal.override.localhost:1355',
					VITE_COMMON_API_ENDPOINT: 'https://api.override.localhost:1355/api/graphql',
					VITE_APP_UI_PORTAL_AUTHORITY: 'https://auth.override.localhost:1355/portal-user',
					VITE_APP_UI_STAFF_BASE_URL: 'https://staff.override.localhost:1355',
				},
				workspaceRoot,
			}),
		).toEqual({
			uiPortal: 'portal.override.localhost',
			uiStaff: 'staff.override.localhost',
			api: 'api.override.localhost',
			mockAuth: 'auth.override.localhost',
			docs: 'docs.portal.override.localhost',
		});
	});

	it('does not duplicate a worktree suffix when hostnames are already scoped', () => {
		const workspaceRoot = createWorkspaceFixture();

		expect(
			getLearnSphereHostnames({
				env: {
					WORKTREE_NAME: 'Jason/Feature 123',
					VITE_APP_UI_PORTAL_BASE_URL: 'https://learnsphere.jason-feature-123.localhost:1355',
					VITE_COMMON_API_ENDPOINT: 'https://data-access.learnsphere.jason-feature-123.localhost:1355/api/graphql',
					VITE_APP_UI_PORTAL_AUTHORITY: 'https://mock-auth.learnsphere.jason-feature-123.localhost:1355/portal-user',
					VITE_APP_UI_STAFF_BASE_URL: 'https://staff.learnsphere.jason-feature-123.localhost:1355',
				},
				workspaceRoot,
			}),
		).toEqual({
			uiPortal: 'learnsphere.jason-feature-123.localhost',
			uiStaff: 'staff.learnsphere.jason-feature-123.localhost',
			api: 'data-access.learnsphere.jason-feature-123.localhost',
			mockAuth: 'mock-auth.learnsphere.jason-feature-123.localhost',
			docs: 'docs.learnsphere.jason-feature-123.localhost',
		});
	});
});

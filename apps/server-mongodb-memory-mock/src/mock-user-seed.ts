import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Db } from 'mongodb';
import { ObjectId } from 'mongodb';

interface MockOidcUser {
	sub: string;
	claims?: {
		email?: string;
		given_name?: string;
		family_name?: string;
		roles?: string[];
	};
}

const managerRoleId = new ObjectId('66c000000000000000000001');
const teamLeadRoleId = new ObjectId('66c000000000000000000002');

const readMockUsers = async (repoRoot: string, appName: string): Promise<MockOidcUser[]> => {
	const filePath = path.join(repoRoot, 'apps', appName, 'mock-oidc.users.json');
	const contents = await readFile(filePath, 'utf8');
	const users = JSON.parse(contents) as unknown;
	if (!Array.isArray(users)) throw new Error(`Mock OIDC users file must contain an array: ${filePath}`);
	return users as MockOidcUser[];
};

const claim = (user: MockOidcUser, key: 'email' | 'given_name' | 'family_name'): string => user.claims?.[key] ?? '';
const roleClaims = (user: MockOidcUser): string[] => user.claims?.roles ?? [];
const normalizedClaim = (value: string): string => value.toLowerCase().replace(/[._ -]/g, '');

const staffRoleIdFor = (user: MockOidcUser): ObjectId => {
	const claims = roleClaims(user).map(normalizedClaim);
	if (claims.includes('manager') || claims.includes('staffmanager')) return managerRoleId;
	if (claims.includes('teamlead') || claims.includes('staffteamlead')) return teamLeadRoleId;
	throw new Error(`No seeded staff role matches mock user ${user.sub}`);
};

export const seedMockUsers = async (db: Db, repoRoot: string): Promise<void> => {
	const [learnerUsers, staffUsers] = await Promise.all([readMockUsers(repoRoot, 'ui-portal'), readMockUsers(repoRoot, 'ui-staff')]);
	const now = new Date();
	await db.collection('organizations').insertMany([
		{ _id: new ObjectId('66f000000000000000000001'), externalId: 'simnova', name: 'SimNova', parentOrganizationId: null, ancestorOrganizationIds: [], createdBy: 'system', schemaVersion: '1.0.0', createdAt: now, updatedAt: now },
		{ _id: new ObjectId('66f000000000000000000002'), externalId: 'simnova-product', name: 'Product Experience', parentOrganizationId: 'simnova', ancestorOrganizationIds: ['simnova'], createdBy: 'system', schemaVersion: '1.0.0', createdAt: now, updatedAt: now },
		{ _id: new ObjectId('66f000000000000000000003'), externalId: 'simnova-data', name: 'Data & Insights', parentOrganizationId: 'simnova', ancestorOrganizationIds: ['simnova'], createdBy: 'system', schemaVersion: '1.0.0', createdAt: now, updatedAt: now },
	]);

	await db.collection('roles').insertMany([
		{
			_id: managerRoleId,
			roleType: 'staff-user-role',
			roleName: 'Manager',
			enterpriseAppRole: 'Staff.Manager',
			isDefault: true,
			permissions: {
				staffPortalPermissions: { canViewTeamLearning: true, canManageCourses: true, canPublishCourses: true, canDeleteCourses: true, canManageTeams: true, canManageTeamOperations: true, canConfirmTeamOperations: true, canManageAssessments: true, canViewOrganization: true, canManageOrganizationStructure: true },
				userPermissions: { canManageUsers: true, canAssignStaffRoles: true, canViewStaffUsers: true },
				staffRolePermissions: { canViewRoles: true, canAddRole: false, canEditRole: false, canRemoveRole: false },
			},
			schemaVersion: '1.0.0',
			createdAt: now,
			updatedAt: now,
		},
		{
			_id: teamLeadRoleId,
			roleType: 'staff-user-role',
			roleName: 'Team Lead',
			enterpriseAppRole: 'Staff.TeamLead',
			isDefault: true,
			permissions: {
				staffPortalPermissions: { canViewTeamLearning: true, canManageCourses: false, canPublishCourses: false, canDeleteCourses: false, canManageTeams: false, canManageTeamOperations: true, canConfirmTeamOperations: false, canManageAssessments: false, canViewOrganization: true, canManageOrganizationStructure: false },
				userPermissions: { canManageUsers: false, canAssignStaffRoles: false, canViewStaffUsers: false },
				staffRolePermissions: { canViewRoles: false, canAddRole: false, canEditRole: false, canRemoveRole: false },
			},
			schemaVersion: '1.0.0',
			createdAt: now,
			updatedAt: now,
		},
	]);

	await db.collection('users').insertMany([
		...learnerUsers.map((user, index) => {
			const firstName = claim(user, 'given_name');
			const lastName = claim(user, 'family_name') || firstName || 'Learner';
			return {
				_id: new ObjectId(`66d00000000000000000000${index + 1}`),
				userType: 'learner-user',
				externalId: user.sub,
				email: claim(user, 'email'),
				displayName: `${firstName} ${lastName}`.trim(),
				personalInformation: {
					identityDetails: { lastName, legalNameConsistsOfOneName: !firstName, ...(firstName ? { restOfName: firstName } : {}) },
					contactInformation: { email: claim(user, 'email') },
				},
				accessBlocked: false,
				tags: [],
				schemaVersion: '1.0.0',
				createdAt: now,
				updatedAt: now,
			};
		}),
		...staffUsers.map((user, index) => {
			const firstName = claim(user, 'given_name');
			const lastName = claim(user, 'family_name');
			return {
				_id: new ObjectId(`66e00000000000000000000${index + 1}`),
				userType: 'staff-user',
				externalId: user.sub,
				firstName,
				lastName,
				email: claim(user, 'email'),
				displayName: `${firstName} ${lastName}`.trim(),
				accessBlocked: false,
				tags: [],
				role: staffRoleIdFor(user),
				activityLog: [],
				organizationScopes: [{ organizationId: 'simnova', includeDescendants: roleClaims(user).some((role) => ['manager', 'staffmanager'].includes(normalizedClaim(role))) }],
				schemaVersion: '1.0.0',
				createdAt: now,
				updatedAt: now,
			};
		}),
	]);
};
